// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import App from './App';

import { TrieNode } from './TrieNode'

test('Can construct a node', () => {
  const node = new TrieNode('a', true, null)

  expect(node.character).toBe('a')
  expect(node.isWord).toBe(true)
  expect(node.parent).toBe(null)
})

test('A null node is a head node', () => {
  const node = new TrieNode()

  expect(node.character).toBe('')
  expect(node.isWord).toBe(null)
  expect(node.parent).toBe(null)

  expect(node.isHead()).toBe(true)
})

test('A non-null node is NOT a head node', () => {
  const node = new TrieNode('a', true, null)

  expect(node.isHead()).toBe(false)
})

test('This trie is unicode tolerant', () => {
  const node = new TrieNode('🍕', true, null)

  expect(node.isHead()).toBe(false)
})

test('A node can have a child node added', () => {
  const head = new TrieNode()
  const baby = head.addChild('a', true)

  expect(baby.character).toBe('a')
  expect(baby.isWord).toBe(true)
  expect(head.children.a).toBe(baby)
})

test('If you try to add a child that exists, but it is now a word terminator where before it wasnt, we just flip that bit and leave the node alone otherwise', () => {
  const head = new TrieNode()
  const firstLetterOfAt = head.addChild('a', false)
  const secondLetterOfAt = firstLetterOfAt.addChild('t', true) // we loaded 'at' into the trie.

  expect(firstLetterOfAt.character).toBe('a')
  expect(firstLetterOfAt.isWord).toBe(false)
  expect(firstLetterOfAt.children.t.character).toBe('t')
  expect(firstLetterOfAt.children.t.isWord).toBe(true)
  expect(firstLetterOfAt.children.t).toBe(secondLetterOfAt)

  const newA = head.addChild('a', true) // now let's add the word 'a' into the trie...
  expect(newA).toBe(firstLetterOfAt) // same ref
  expect(newA.isWord).toBe(true) // now true
})

test('walkback() returns the whole string from the given node.', () => {
  const head = new TrieNode()
  const nodeA = head.addChild('a', false)
  const nodeB = nodeA.addChild('b', false)
  const nodeC = nodeB.addChild('c', false)
  const nodeD = nodeC.addChild('d', false)
  const nodeE = nodeD.addChild('e', false)
  const nodeF = nodeE.addChild('f', false)

  expect(nodeC.walkBack()).toBe('abc')
  expect(nodeF.walkBack()).toBe('abcdef')
})

test('Everything is fine if there are branches...', () => {
  const head = new TrieNode()
  const nodeA = head.addChild('a', false)
  const nodeB = nodeA.addChild('t', false)
  const nodeC = nodeB.addChild('e', false)

  const nodeSpace = nodeA.addChild(' ', false)
  const nodePizza = nodeSpace.addChild('🍕', true)

  expect(nodeC.walkBack()).toBe('ate')
  expect(nodePizza.walkBack()).toBe('a 🍕')
})

test('getChildNodes() returns a TrieNode[] of the children.', () => {
  const head = new TrieNode()
  const n1 = head.addChild('a', false)
  const n2 = head.addChild('1', false)
  const n3 = head.addChild('🍕', false)
  const n4 = head.addChild('~', false)

  const res = head.getAllChildNodes()

  expect(res).toContain(n1)
  expect(res).toContain(n2)
  expect(res).toContain(n3)
  expect(res).toContain(n4)
})
