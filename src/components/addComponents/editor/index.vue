<template>
  <div class="editor">
    <!-- 只在hover的时候在大容器的编辑器加上篮筐 -->
    <editor-menu-bar :style="center ? 'left: 50%; transform: translateX(-50%)' : ''" :editor="editor" v-slot="{ commands, isActive, focused, getMarkAttrs }">
      <div class="menubar is-hidden" :class="{ 'is-focused': focused }">
        <button class="menubar__button" @click="commands.undo">
          <svg-icon class="svg_icon" icon-class="undo" />
        </button>

        <button class="menubar__button" @click="commands.redo">
          <svg-icon class="svg_icon" icon-class="redo" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <svg-icon class="svg_icon" icon-class="bold" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <svg-icon class="svg_icon" icon-class="italic" />
        </button>

        <button
          class="menububble__button"
          @click="showLinkMenu(getMarkAttrs('link'))"
          :class="{ 'is-active': isActive.link() }"
        >
          <svg-icon class="svg_icon" icon-class="link" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <svg-icon class="svg_icon" icon-class="strike" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <svg-icon class="svg_icon" icon-class="underline" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          <svg-icon class="svg_icon" icon-class="paragraph" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >H1</button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >H2</button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >H3</button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <svg-icon class="svg_icon" icon-class="ul" />
        </button>
        <button class="menubar__button" @click="commands.horizontal_rule">
          <svg-icon class="svg_icon" icon-class="hr" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <svg-icon class="svg_icon" icon-class="ol" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <svg-icon class="svg_icon" icon-class="quote" />
        </button>
      </div>
    </editor-menu-bar>

    <editor-menu-bubble
      v-if="editable"
      class="menububble"
      :editor="editor"
      @hide="hideLinkMenu"
      :style="center ? 'text-align: center' : ''"
      v-slot="{ commands, isActive, menu }"
    >
      <div
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <form
          class="menububble__form"
          v-if="linkMenuIsActive"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            class="menububble__input"
            type="text"
            v-model="linkUrl"
            placeholder="https://"
            ref="linkInput"
            @keydown.esc="hideLinkMenu"
          />
          <button class="menububble__button" @click="setLinkUrl(commands.link, null)" type="button">
            <svg-icon class="svg_icon" icon-class="remove" />
          </button>
        </form>
      </div>
    </editor-menu-bubble>

    <editor-content class="editor__content" :style="center ? 'text-align: center' : ''" :editor="editor" />
    <!-- <button @click="getContent">获取HTML</button> -->
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import {
  Blockquote,
  BulletList,
  HardBreak,
  Heading,
  ListItem,
  OrderedList,
  TodoItem,
  HorizontalRule,
  TodoList,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Placeholder
} from 'tiptap-extensions'
import Doc from './Doc'
import Title from './Title'

export default {
  props: {
    content: String,
    needContent: Boolean,
    center: {
      type: Boolean,
      default: false
    },
    needTitle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hideBar: false,
      editor: null,
      linkUrl: null,
      linkMenuIsActive: false,
      hideBubble: true,
      editable: false
    }
  },
  created () {
  },
  mounted () {
    this.initEditor()
  },
  watch: {
    needContent: {
      handler (newV) {
        if (newV) {
          // // console.log(this.getContent(), ' this.getContent()')
          this.$emit('update:content', this.getContent())
        }
      }
    },
    content (newV) {
      // // console.log(newV, 'editorContent')
      this.initEditor()
    },
    editable () {
      // // console.log(this.editable, 'editor')
      this.editor.setOptions({
        editable: this.editable
      })
    },
    '$store.state.user.isBlogger': {
      handler (val) {
        // // console.log(val, 'isBlogger')
        this.editable = val
      },
      immediate: true
    }
  },
  updated: function () {
    this.$nextTick(function () {
      var ProseMirror = document.getElementsByClassName('ProseMirror')
      var parent = document.getElementsByClassName('editor__content')[0]
      if (ProseMirror.length === 2) { // 点击文章列表进入具体文章时，editor赋值时会造成原来的+新插入的，所以会有两个，要删除第一个编辑器
        parent.removeChild(ProseMirror[0])
        // console.log(ProseMirror, 'ProseMirror')
      }
    // Code that will run only after the
    // entire view has been re-rendered
    })
  },
  methods: {
    initEditor () {
      if (this.needTitle) {
        this.editor = new Editor({
          editable: this.editable,
          content: this.content,
          autoFocus: false,
          extensions: [
            new Blockquote(),
            new BulletList(),
            new HardBreak(),
            new Heading({ levels: [1, 2, 3] }),
            new ListItem(),
            new OrderedList(),
            new HorizontalRule(),
            new TodoItem(),
            new TodoList(),
            new Link(),
            new Bold(),
            new Italic(),
            new Strike(),
            new Underline(),
            new History(),
            new Doc(),
            new Title(),
            new Placeholder({
              showOnlyCurrent: false,
              emptyNodeText: node => {
                if (node.type.name === 'title') {
                  return 'Give me a name'
                }
                return 'Write something'
              }
            })
          ]
        })
      } else {
        this.editor = new Editor({
          editable: this.editable,
          content: this.content,
          extensions: [
            new Blockquote(),
            new BulletList(),
            new HardBreak(),
            new Heading({ levels: [1, 2, 3] }),
            new ListItem(),
            new OrderedList(),
            new HorizontalRule(),
            new TodoItem(),
            new TodoList(),
            new Link(),
            new Bold(),
            new Italic(),
            new Strike(),
            new Underline(),
            new History(),
            new Placeholder({
              showOnlyCurrent: false,
              emptyNodeText: node => {
                return 'Write something'
              }
            })
          ],
          autoFocus: false
        })
      }
    },
    focus (e) { // 给div或其他非input元素注册focus函数需要加上 tabindex="0" 这样的属性
      // // console.log(e, 'focus')
      this.hideBar = true
    },
    blur (e) { // 给div或其他非input元素注册focus函数需要加上 tabindex="0" 这样的属性
      // this.hideBar = false
      // // console.log(e, 'blur')
    },
    getContent () {
      return this.editor.getHTML()
      // // // console.log(this.editor.getHTML(), 'content')
    },
    showLinkMenu (attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu () {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl (command, url) {
      command({ href: url })
      this.hideLinkMenu()
    }
  },
  components: {
    EditorContent,
    EditorMenuBubble,
    EditorMenuBar
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>
<style lang="scss">
.detailBlogs_title {
  font-weight: 500;
  font-size: 3rem;
}
.detailBlogs_title:focus {
  outline: none;
}

.editor *.is-empty:nth-child(1)::before,
.editor *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}
.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: #333333;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
  .svg_icon {
    fill: #a1a1a1;
  }

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: #a1a1a1;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba(white, 0.1);
    }

    &.is-active {
      background-color: rgba(white, 0.2);
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input {
    font: inherit;
    border: none;
    background: transparent;
    color: #f3f3f3;
  }
}

.editor {
  position: relative;
  max-width: 100%;
  margin: 0 auto 5rem auto;

/*   &__content:hover {
    border-radius: 3px;
    box-shadow: 0 0 0 2px color(primary);
  } */

  &__content {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    transition: box-shadow 0.3s;
    padding: 5px 15px;

    * {
      caret-color: currentColor;
    }

    pre {
      padding: 0.7rem 1rem;
      border-radius: 5px;
      background: black;
      color: white;
      font-size: 0.8rem;
      overflow-x: auto;

      code {
        display: block;
      }
    }

    p code {
      display: inline-block;
      padding: 1rem;
      border-radius: 5px;
      font-size: 0.8rem;
      font-weight: bold;
      background: rgba(black, 0.1);
      color: rgba(black, 0.8);
    }

    ul,
    ol {
      padding: 1rem;
    }

    li > p,
    li > ol,
    li > ul {
      margin: 0;
    }

    a {
      color: inherit;
      text-decoration: underline;
    }

    blockquote {
      border-left: 3px solid rgba(black, 0.1);
      color: rgba(black, 0.8);
      padding: 1rem;
      font-style: italic;

      p {
        margin: 0;
      }
    }

    img {
      max-width: 100%;
      border-radius: 3px;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;

      td,
      th {
        min-width: 1em;
        border: 2px solid #dddddd;
        padding: 3px 5px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
        > * {
          margin-bottom: 0;
        }
      }

      th {
        font-weight: bold;
        text-align: left;
      }

      .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(200, 200, 255, 0.4);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        width: 4px;
        z-index: 20;
        background-color: #adf;
        pointer-events: none;
      }
    }

    .tableWrapper {
      margin: 1em 0;
      overflow-x: auto;
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
}
.menubar {
  position: absolute;
  width: 38rem;
  height: 30px;
  line-height: 30px;
  margin-bottom: 1rem;
  background: #333333;
  text-align: center;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
  .svg_icon {
    fill: #a1a1a1;
  }

  &.is-hidden {
    visibility: hidden;
    opacity: 0;
  }

  &.is-focused {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s, opacity 0.2s;
  }

  &__button {
    font-weight: bold;
    background: transparent;
    border: 0;
    padding: 0 0.6rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    color: #a1a1a1;
    cursor: pointer;

    &:hover {
      background-color: rgba(black, 0.05);
    }

    &.is-active {
      background-color: rgba(black, 0.1);
    }
  }

  span#{&}__button {
    font-size: 13.3333px;
  }
}
</style>
