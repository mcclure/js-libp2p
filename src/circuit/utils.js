'use strict'

const { CID } = require('multiformats')
const { sha256 } = require('multiformats/hashes/sha2')

const TextEncoder = require('ipfs-utils/src/text-encoder')

/**
 * Convert a namespace string into a cid.
 *
 * @param {string} namespace
 * @returns {Promise<CID>}
 */
module.exports.namespaceToCid = async (namespace) => {
  const bytes = new TextEncoder().encode(namespace)
  const hash = await sha256.digest(bytes)

  return CID.createV0(hash)
}
