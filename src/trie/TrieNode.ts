import { NullableBoolean } from '../types'

export type NullableTrieNode = TrieNode | null

export class TrieNode {
  character!: string

  isWord!: NullableBoolean

  parent!: NullableTrieNode

  children!: Record<string, TrieNode>

  constructor(character = '', isWord: NullableBoolean = null, parent: NullableTrieNode = null) {
    this.character = character
    this.isWord = isWord
    this.parent = parent
    this.children = {}
  }

  isHead(): boolean {
    return this.character === '' && this.isWord === null && this.parent === null
  }

  addChild(char: string, isWord: boolean): TrieNode {
    if (this.children[char]) {
      if (!this.children[char].isWord && isWord) {
        this.children[char].isWord = true
      }
    } else {
      this.children[char] = new TrieNode(char, isWord, this)
    }

    return this.children[char]
  }

  walkBack(): string {
    let ret = ''
    let curNode: TrieNode = this

    while (!curNode.isHead()) {
      ret = curNode.character + ret
      curNode = curNode.parent as TrieNode
    }

    return ret
  }

  getAllChildNodes(): TrieNode[] {
    return Object.values(this.children)
  }
}
