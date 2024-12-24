const sax = require('sax');
const fs = require('fs');
const { merge } = require('lodash')
/**
 * @typedef {
 *  title: string
*   text: string
*   type: rss
*   htmlUrl: string
*   xmlUrl: string
 * } OPMLNode
 */

/**
 * @param {string} opmlXML 
 * @returns {Promise<Array<OPMLNode>>}
 */
function parseOPML(opmlXML) {

  return new Promise((resolve, reject) => {
    const parser = sax.parser({
      strict: true,
      lowercase: true
    });

    const openTags = [];

    const result = [];

    parser.onopentag = function (node) {
      openTags.push(node);
    };
    parser.onclosetag = function (nodeName) {
      if (openTags[openTags.length - 1].name === nodeName) {
        const node = openTags.pop();

        if (node.name === 'outline') {
          const parent = openTags[openTags.length - 1];
          if (parent.name === 'outline') {
            if (parent.children) {
              parent.children.push(node.attributes);
            } else {
              parent.children = [node.attributes];
            }
          } else {
            result.push({
              ...node.attributes,
              children: node.children
            });
          }
        }
  
      } else {
        throw new Error('XML format error');
      }
    };

    parser.onend = function () {
      resolve(result);
    }

    try {
      parser.write(opmlXML).close();
    } catch (error) {
      reject(error);
    }
  });
}

class JsonOperator {
  constructor(filePath) {
    this.filePath = filePath;
  }

  /**
   * @param {string} k 
   * @returns 
   */
  get(k) {
    try {
      const fileData = fs.readFileSync(this.filePath, 'utf8');
      const jsonData = JSON.parse(fileData);
      return k !== undefined ? jsonData[k] : jsonData;
    } catch (error) {
      console.error(`Error reading JSON file: ${error.message}`);
      return null;
    }
  }
  set(data) {
    try {
      const currentData = this.get() || {};
      const newData = merge(currentData, data);
      const jsonString = JSON.stringify(newData, null, 2);
      fs.writeFileSync(this.filePath, jsonString, 'utf8');
      console.log('JSON file updated successfully.');
    } catch (error) {
      console.error(`Error writing JSON file: ${error.message}`);
    }
  }
}


exports.parseOPML = parseOPML;
exports.JsonOperator = JsonOperator;
