const debug = require('debug')('ia:search:collection:debug');
const error = require('debug')('ia:search:collection:error');
const fetch = require('node-fetch');
const mustache = require('mustache');

const config = require('../config');

/*
 Could be interesting Fields:

 from: https://archive.org/metadata/78rpm
 metadata.spotlight_identifier:"OldMacdonaldHadAFarmBySamPattersonTrio1926"

 from: https://archive.org/metadata/etree
 subject:"Live Music"
 title_message:"Free Music"
 */
/**
 * Fetch details about collection
 *
 * @param {string} id - identifier of collection
 */
function fetchDetails (id) {
  debug(`fetch collection ${id}`);
  return fetch(mustache.render(config.endpoints.COLLECTION_URL, {id}))
    .then(res => res.json())
    .then(data => {
      return {
        title: data.metadata.title,
      };
    })
    .catch(e => {
      error(`Get error on fetching collection ${id}, error: ${JSON.stringify(e)}`);
      return Promise.reject(e);
    });
}

/**
 * Fetch items of collection
 *
 * @param {string} id - identifier of collection
 * @returns {Promise}
 */
function fetchItems (id) {
  return fetch(mustache.render(config.endpoints.COLLECTION_ITEMS_URL, {id}))
    .then(res => res.json())
    .then(data => {
      return data.response.docs;
    })
}

module.exports = {
  fetchDetails,
  fetchItems,
};
