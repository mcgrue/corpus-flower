// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import App from './App';

import { Corpus } from './Corpus'

test('Can construct a Corpus', () => {
  const corpus = new Corpus(false)

  expect(corpus.head.isHead()).toBe(true)
  expect(corpus.isCaseSensitive).toBe(false)
})

test('Can add a word', () => {
  const corpus = new Corpus(false)
  const wordNode = corpus.addWord('butt')

  expect(wordNode.walkBack()).toBe('butt')
})

test('Can add two words and the endpoints are valid', () => {
  const corpus = new Corpus(false)
  const butteNode = corpus.addWord('butte')

  expect(butteNode.isWord).toBe(true)
  expect(butteNode.parent!.isWord).toBe(false) // 'butt' isnt a word yet

  corpus.addWord('butt')

  expect(butteNode.parent!.isWord).toBe(true) // now it is!
})

test('Can walk to a non-word node given a string input', () => {
  const corpus = new Corpus(false)
  corpus.addWord('butte')

  const node = corpus.fetchNode('but')!
  expect(node.isWord).toBe(false)
  expect(node.children.t!.character).toBe('t')
  expect(node.children.t!.children.e!.character).toBe('e')
  expect(node.children.t!.children.e!.isWord).toBe(true)
})

describe('case tests - ', () => {
  const inputWords = [
    'mercury',
    'VENUS',
    '🌍',
    'MARS',
    'Jupiter',
    'Saturn',
    '🍑',
    'Neptune',
    // 'Pluto'
  ]

  describe('case insensitive tests', () => {
    let corpus: Corpus

    beforeEach(() => {
      corpus = new Corpus(false)
      inputWords.forEach((w) => {
        corpus.addWord(w)
      })
    })

    test('Words get lowercased in case-insens land!', () => {
      expect(corpus.isWord('VENUS')).toBe(true)
      expect(corpus.isWord('venus')).toBe(true)
      expect(corpus.isWord('🌍')).toBe(true)
    })
  })

  describe('CaSe SENSITIVE TeStS', () => {
    let corpus: Corpus

    beforeEach(() => {
      corpus = new Corpus(true)
      inputWords.forEach((w) => {
        corpus.addWord(w)
      })
    })

    test('Words get lowercased in case-insens land!', () => {
      expect(corpus.isWord('VENUS')).toBe(true)
      expect(corpus.isWord('venus')).toBe(false)
      expect(corpus.isWord('🌍')).toBe(true)
    })
  })
})

describe('search tests ', () => {
  const inputWords = [
    'but',
    'bunny',
    'zaa',
    'bent',
    'bend',
    'butte',
    'hoobes',
    'bunnies',
    'bUTt',
    'brett',
    'zebra',
    'bundt',
    'hoobalicious',
    'zest',
    'bun',
    'butts',
    'hoobo',
    'bender',
    'bunt',
    'hobba',
    'hoober',
    'zedzedzed',
  ]

  let corpus: Corpus

  beforeEach(() => {
    corpus = new Corpus(true)
    inputWords.forEach((w) => {
      corpus.addWord(w)
    })
  })

  test('fetch autocomplete words', () => {
    const results = corpus.getBroadWords('bu', 3)

    expect(results[0]).toBe('but')
    expect(results[1]).toBe('bun')
    expect(results[2]).toBe('bunt')

    const results2 = corpus.getBroadWords('bu', 1)

    expect(results2[0]).toBe('but')
  })

  test('get all words', () => {
    expect(corpus.getAllWords()).toBe(inputWords)
  })
})
