import { TrieNode, NullableTrieNode } from './TrieNode'

interface TrieWalkFunction {
  (nodesToVisit: TrieNode[], curNode: TrieNode): TrieNode[]
}

export class Corpus {
  readonly head: TrieNode

  readonly isCaseSensitive: boolean

  private dictionaryMap: Record<string, TrieNode>

  private wordSet: Set<string>

  constructor(isCaseSensitive: boolean) {
    this.head = new TrieNode()
    this.isCaseSensitive = isCaseSensitive
    this.dictionaryMap = {}
    this.wordSet = new Set()
  }

  getAllWords(): string[] {
    return Array.from(this.wordSet.values())
  }

  addWord(word: string): TrieNode {
    if (!this.isCaseSensitive) {
      word = word.toLowerCase()
    }

    if (this.dictionaryMap[word]) {
      return this.dictionaryMap[word]
    }

    let curNode = this.head

    for (let i = 0; i < word.length; i++) {
      curNode = curNode.addChild(word.charAt(i), false)
    }

    curNode.isWord = true

    this.dictionaryMap[word] = curNode
    this.wordSet.add(word)

    return curNode
  }

  isWord(word: string): boolean {
    if (!this.isCaseSensitive) {
      word = word.toLowerCase()
    }

    return !!this.dictionaryMap[word]
  }

  fetchNode(fragment: string): NullableTrieNode {
    if (!this.isCaseSensitive) {
      fragment = fragment.toLowerCase()
    }

    const cachedMaybe = this.dictionaryMap[fragment]
    if (cachedMaybe) {
      return cachedMaybe
    }

    let curNode = this.head

    for (let i = 0; i < fragment.length; i++) {
      curNode = curNode.children[fragment.charAt(i)]

      if (!curNode) {
        return null
      }
    }

    return curNode
  }

  private childrenwalkCommon(word: string, limit: number, fn: TrieWalkFunction): string[] {
    const ret: string[] = []
    // const tmp = word;

    if (limit <= 0) {
      throw new Error('limit must be a positive non-zero number')
    }

    const root = this.fetchNode(word)

    if (!root) {
      return ret
    }

    // let curNode!: TrieNode
    let nodesToVisit: TrieNode[] = []

    nodesToVisit = nodesToVisit.concat(root.getAllChildNodes())

    while (nodesToVisit.length > 0 && ret.length < limit) {
      const curNode = nodesToVisit.shift() as TrieNode // pop is bottom
      nodesToVisit = fn(nodesToVisit, curNode)

      if (curNode.isWord) {
        ret.push(curNode.walkBack())
      }
    }

    return ret
  }

  getBroadWords(word: string, limit: number): string[] {
    const fn = (nodesToVisit: TrieNode[], curNode: TrieNode): TrieNode[] =>
      nodesToVisit.concat(Object.values(curNode.children) as TrieNode[])

    return this.childrenwalkCommon(word, limit, fn)
  }

  /*
    def fn(nodes_to_visit, currentnode):
      childs = sorted(currentnode.children.values(), key=lambda x: x.char)
      nodes_to_visit.extend(childs)

    return self._childrenwalkCommon(
      word,
      limit,
      fn
    )
    */
}
