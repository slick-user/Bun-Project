var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/figlet/lib/figlet.js
var require_figlet = __commonJS((exports, module) => {
  var figlet = (() => {
    const FULL_WIDTH = 0, FITTING = 1, SMUSHING = 2, CONTROLLED_SMUSHING = 3;
    const figFonts = {};
    const figDefaults = {
      font: "Standard",
      fontPath: "./fonts"
    };
    function getSmushingRules(oldLayout, newLayout) {
      let rules = {};
      let val, index, len, code;
      let codes = [
        [16384, "vLayout", SMUSHING],
        [8192, "vLayout", FITTING],
        [4096, "vRule5", true],
        [2048, "vRule4", true],
        [1024, "vRule3", true],
        [512, "vRule2", true],
        [256, "vRule1", true],
        [128, "hLayout", SMUSHING],
        [64, "hLayout", FITTING],
        [32, "hRule6", true],
        [16, "hRule5", true],
        [8, "hRule4", true],
        [4, "hRule3", true],
        [2, "hRule2", true],
        [1, "hRule1", true]
      ];
      val = newLayout !== null ? newLayout : oldLayout;
      index = 0;
      len = codes.length;
      while (index < len) {
        code = codes[index];
        if (val >= code[0]) {
          val = val - code[0];
          rules[code[1]] = typeof rules[code[1]] === "undefined" ? code[2] : rules[code[1]];
        } else if (code[1] !== "vLayout" && code[1] !== "hLayout") {
          rules[code[1]] = false;
        }
        index++;
      }
      if (typeof rules["hLayout"] === "undefined") {
        if (oldLayout === 0) {
          rules["hLayout"] = FITTING;
        } else if (oldLayout === -1) {
          rules["hLayout"] = FULL_WIDTH;
        } else {
          if (rules["hRule1"] || rules["hRule2"] || rules["hRule3"] || rules["hRule4"] || rules["hRule5"] || rules["hRule6"]) {
            rules["hLayout"] = CONTROLLED_SMUSHING;
          } else {
            rules["hLayout"] = SMUSHING;
          }
        }
      } else if (rules["hLayout"] === SMUSHING) {
        if (rules["hRule1"] || rules["hRule2"] || rules["hRule3"] || rules["hRule4"] || rules["hRule5"] || rules["hRule6"]) {
          rules["hLayout"] = CONTROLLED_SMUSHING;
        }
      }
      if (typeof rules["vLayout"] === "undefined") {
        if (rules["vRule1"] || rules["vRule2"] || rules["vRule3"] || rules["vRule4"] || rules["vRule5"]) {
          rules["vLayout"] = CONTROLLED_SMUSHING;
        } else {
          rules["vLayout"] = FULL_WIDTH;
        }
      } else if (rules["vLayout"] === SMUSHING) {
        if (rules["vRule1"] || rules["vRule2"] || rules["vRule3"] || rules["vRule4"] || rules["vRule5"]) {
          rules["vLayout"] = CONTROLLED_SMUSHING;
        }
      }
      return rules;
    }
    function hRule1_Smush(ch1, ch2, hardBlank) {
      if (ch1 === ch2 && ch1 !== hardBlank) {
        return ch1;
      }
      return false;
    }
    function hRule2_Smush(ch1, ch2) {
      let rule2Str = "|/\\[]{}()<>";
      if (ch1 === "_") {
        if (rule2Str.indexOf(ch2) !== -1) {
          return ch2;
        }
      } else if (ch2 === "_") {
        if (rule2Str.indexOf(ch1) !== -1) {
          return ch1;
        }
      }
      return false;
    }
    function hRule3_Smush(ch1, ch2) {
      let rule3Classes = "| /\\ [] {} () <>";
      let r3_pos1 = rule3Classes.indexOf(ch1);
      let r3_pos2 = rule3Classes.indexOf(ch2);
      if (r3_pos1 !== -1 && r3_pos2 !== -1) {
        if (r3_pos1 !== r3_pos2 && Math.abs(r3_pos1 - r3_pos2) !== 1) {
          const startPos = Math.max(r3_pos1, r3_pos2);
          const endPos = startPos + 1;
          return rule3Classes.substring(startPos, endPos);
        }
      }
      return false;
    }
    function hRule4_Smush(ch1, ch2) {
      let rule4Str = "[] {} ()";
      let r4_pos1 = rule4Str.indexOf(ch1);
      let r4_pos2 = rule4Str.indexOf(ch2);
      if (r4_pos1 !== -1 && r4_pos2 !== -1) {
        if (Math.abs(r4_pos1 - r4_pos2) <= 1) {
          return "|";
        }
      }
      return false;
    }
    function hRule5_Smush(ch1, ch2) {
      let rule5Str = "/\\ \\/ ><";
      let rule5Hash = { 0: "|", 3: "Y", 6: "X" };
      let r5_pos1 = rule5Str.indexOf(ch1);
      let r5_pos2 = rule5Str.indexOf(ch2);
      if (r5_pos1 !== -1 && r5_pos2 !== -1) {
        if (r5_pos2 - r5_pos1 === 1) {
          return rule5Hash[r5_pos1];
        }
      }
      return false;
    }
    function hRule6_Smush(ch1, ch2, hardBlank) {
      if (ch1 === hardBlank && ch2 === hardBlank) {
        return hardBlank;
      }
      return false;
    }
    function vRule1_Smush(ch1, ch2) {
      if (ch1 === ch2) {
        return ch1;
      }
      return false;
    }
    function vRule2_Smush(ch1, ch2) {
      let rule2Str = "|/\\[]{}()<>";
      if (ch1 === "_") {
        if (rule2Str.indexOf(ch2) !== -1) {
          return ch2;
        }
      } else if (ch2 === "_") {
        if (rule2Str.indexOf(ch1) !== -1) {
          return ch1;
        }
      }
      return false;
    }
    function vRule3_Smush(ch1, ch2) {
      let rule3Classes = "| /\\ [] {} () <>";
      let r3_pos1 = rule3Classes.indexOf(ch1);
      let r3_pos2 = rule3Classes.indexOf(ch2);
      if (r3_pos1 !== -1 && r3_pos2 !== -1) {
        if (r3_pos1 !== r3_pos2 && Math.abs(r3_pos1 - r3_pos2) !== 1) {
          const startPos = Math.max(r3_pos1, r3_pos2);
          const endPos = startPos + 1;
          return rule3Classes.substring(startPos, endPos);
        }
      }
      return false;
    }
    function vRule4_Smush(ch1, ch2) {
      if (ch1 === "-" && ch2 === "_" || ch1 === "_" && ch2 === "-") {
        return "=";
      }
      return false;
    }
    function vRule5_Smush(ch1, ch2) {
      if (ch1 === "|" && ch2 === "|") {
        return "|";
      }
      return false;
    }
    function uni_Smush(ch1, ch2, hardBlank) {
      if (ch2 === " " || ch2 === "") {
        return ch1;
      } else if (ch2 === hardBlank && ch1 !== " ") {
        return ch1;
      } else {
        return ch2;
      }
    }
    function canVerticalSmush(txt1, txt2, opts) {
      if (opts.fittingRules.vLayout === FULL_WIDTH) {
        return "invalid";
      }
      let ii, len = Math.min(txt1.length, txt2.length), ch1, ch2, endSmush = false, validSmush;
      if (len === 0) {
        return "invalid";
      }
      for (ii = 0;ii < len; ii++) {
        ch1 = txt1.substring(ii, ii + 1);
        ch2 = txt2.substring(ii, ii + 1);
        if (ch1 !== " " && ch2 !== " ") {
          if (opts.fittingRules.vLayout === FITTING) {
            return "invalid";
          } else if (opts.fittingRules.vLayout === SMUSHING) {
            return "end";
          } else {
            if (vRule5_Smush(ch1, ch2)) {
              endSmush = endSmush || false;
              continue;
            }
            validSmush = false;
            validSmush = opts.fittingRules.vRule1 ? vRule1_Smush(ch1, ch2) : validSmush;
            validSmush = !validSmush && opts.fittingRules.vRule2 ? vRule2_Smush(ch1, ch2) : validSmush;
            validSmush = !validSmush && opts.fittingRules.vRule3 ? vRule3_Smush(ch1, ch2) : validSmush;
            validSmush = !validSmush && opts.fittingRules.vRule4 ? vRule4_Smush(ch1, ch2) : validSmush;
            endSmush = true;
            if (!validSmush) {
              return "invalid";
            }
          }
        }
      }
      if (endSmush) {
        return "end";
      } else {
        return "valid";
      }
    }
    function getVerticalSmushDist(lines1, lines2, opts) {
      let maxDist = lines1.length;
      let len1 = lines1.length;
      let len2 = lines2.length;
      let subLines1, subLines2, slen;
      let curDist = 1;
      let ii, ret, result;
      while (curDist <= maxDist) {
        subLines1 = lines1.slice(Math.max(0, len1 - curDist), len1);
        subLines2 = lines2.slice(0, Math.min(maxDist, curDist));
        slen = subLines2.length;
        result = "";
        for (ii = 0;ii < slen; ii++) {
          ret = canVerticalSmush(subLines1[ii], subLines2[ii], opts);
          if (ret === "end") {
            result = ret;
          } else if (ret === "invalid") {
            result = ret;
            break;
          } else {
            if (result === "") {
              result = "valid";
            }
          }
        }
        if (result === "invalid") {
          curDist--;
          break;
        }
        if (result === "end") {
          break;
        }
        if (result === "valid") {
          curDist++;
        }
      }
      return Math.min(maxDist, curDist);
    }
    function verticallySmushLines(line1, line2, opts) {
      let ii, len = Math.min(line1.length, line2.length);
      let ch1, ch2, result = "", validSmush;
      for (ii = 0;ii < len; ii++) {
        ch1 = line1.substring(ii, ii + 1);
        ch2 = line2.substring(ii, ii + 1);
        if (ch1 !== " " && ch2 !== " ") {
          if (opts.fittingRules.vLayout === FITTING) {
            result += uni_Smush(ch1, ch2);
          } else if (opts.fittingRules.vLayout === SMUSHING) {
            result += uni_Smush(ch1, ch2);
          } else {
            validSmush = false;
            validSmush = opts.fittingRules.vRule5 ? vRule5_Smush(ch1, ch2) : validSmush;
            validSmush = !validSmush && opts.fittingRules.vRule1 ? vRule1_Smush(ch1, ch2) : validSmush;
            validSmush = !validSmush && opts.fittingRules.vRule2 ? vRule2_Smush(ch1, ch2) : validSmush;
            validSmush = !validSmush && opts.fittingRules.vRule3 ? vRule3_Smush(ch1, ch2) : validSmush;
            validSmush = !validSmush && opts.fittingRules.vRule4 ? vRule4_Smush(ch1, ch2) : validSmush;
            result += validSmush;
          }
        } else {
          result += uni_Smush(ch1, ch2);
        }
      }
      return result;
    }
    function verticalSmush(lines1, lines2, overlap, opts) {
      let len1 = lines1.length;
      let len2 = lines2.length;
      let piece1 = lines1.slice(0, Math.max(0, len1 - overlap));
      let piece2_1 = lines1.slice(Math.max(0, len1 - overlap), len1);
      let piece2_2 = lines2.slice(0, Math.min(overlap, len2));
      let ii, len, line, piece2 = [], piece3, result = [];
      len = piece2_1.length;
      for (ii = 0;ii < len; ii++) {
        if (ii >= len2) {
          line = piece2_1[ii];
        } else {
          line = verticallySmushLines(piece2_1[ii], piece2_2[ii], opts);
        }
        piece2.push(line);
      }
      piece3 = lines2.slice(Math.min(overlap, len2), len2);
      return result.concat(piece1, piece2, piece3);
    }
    function padLines(lines, numSpaces) {
      let ii, len = lines.length, padding = "";
      for (ii = 0;ii < numSpaces; ii++) {
        padding += " ";
      }
      for (ii = 0;ii < len; ii++) {
        lines[ii] += padding;
      }
    }
    function smushVerticalFigLines(output, lines, opts) {
      let len1 = output[0].length;
      let len2 = lines[0].length;
      let overlap;
      if (len1 > len2) {
        padLines(lines, len1 - len2);
      } else if (len2 > len1) {
        padLines(output, len2 - len1);
      }
      overlap = getVerticalSmushDist(output, lines, opts);
      return verticalSmush(output, lines, overlap, opts);
    }
    function getHorizontalSmushLength(txt1, txt2, opts) {
      if (opts.fittingRules.hLayout === FULL_WIDTH) {
        return 0;
      }
      let ii, len1 = txt1.length, len2 = txt2.length;
      let maxDist = len1;
      let curDist = 1;
      let breakAfter = false;
      let validSmush = false;
      let seg1, seg2, ch1, ch2;
      if (len1 === 0) {
        return 0;
      }
      distCal:
        while (curDist <= maxDist) {
          const seg1StartPos = len1 - curDist;
          seg1 = txt1.substring(seg1StartPos, seg1StartPos + curDist);
          seg2 = txt2.substring(0, Math.min(curDist, len2));
          for (ii = 0;ii < Math.min(curDist, len2); ii++) {
            ch1 = seg1.substring(ii, ii + 1);
            ch2 = seg2.substring(ii, ii + 1);
            if (ch1 !== " " && ch2 !== " ") {
              if (opts.fittingRules.hLayout === FITTING) {
                curDist = curDist - 1;
                break distCal;
              } else if (opts.fittingRules.hLayout === SMUSHING) {
                if (ch1 === opts.hardBlank || ch2 === opts.hardBlank) {
                  curDist = curDist - 1;
                }
                break distCal;
              } else {
                breakAfter = true;
                validSmush = false;
                validSmush = opts.fittingRules.hRule1 ? hRule1_Smush(ch1, ch2, opts.hardBlank) : validSmush;
                validSmush = !validSmush && opts.fittingRules.hRule2 ? hRule2_Smush(ch1, ch2, opts.hardBlank) : validSmush;
                validSmush = !validSmush && opts.fittingRules.hRule3 ? hRule3_Smush(ch1, ch2, opts.hardBlank) : validSmush;
                validSmush = !validSmush && opts.fittingRules.hRule4 ? hRule4_Smush(ch1, ch2, opts.hardBlank) : validSmush;
                validSmush = !validSmush && opts.fittingRules.hRule5 ? hRule5_Smush(ch1, ch2, opts.hardBlank) : validSmush;
                validSmush = !validSmush && opts.fittingRules.hRule6 ? hRule6_Smush(ch1, ch2, opts.hardBlank) : validSmush;
                if (!validSmush) {
                  curDist = curDist - 1;
                  break distCal;
                }
              }
            }
          }
          if (breakAfter) {
            break;
          }
          curDist++;
        }
      return Math.min(maxDist, curDist);
    }
    function horizontalSmush(textBlock1, textBlock2, overlap, opts) {
      let ii, jj, outputFig = [], overlapStart, piece1, piece2, piece3, len1, len2, txt1, txt2;
      for (ii = 0;ii < opts.height; ii++) {
        txt1 = textBlock1[ii];
        txt2 = textBlock2[ii];
        len1 = txt1.length;
        len2 = txt2.length;
        overlapStart = len1 - overlap;
        piece1 = txt1.substr(0, Math.max(0, overlapStart));
        piece2 = "";
        const seg1StartPos = Math.max(0, len1 - overlap);
        var seg1 = txt1.substring(seg1StartPos, seg1StartPos + overlap);
        var seg2 = txt2.substring(0, Math.min(overlap, len2));
        for (jj = 0;jj < overlap; jj++) {
          var ch1 = jj < len1 ? seg1.substring(jj, jj + 1) : " ";
          var ch2 = jj < len2 ? seg2.substring(jj, jj + 1) : " ";
          if (ch1 !== " " && ch2 !== " ") {
            if (opts.fittingRules.hLayout === FITTING) {
              piece2 += uni_Smush(ch1, ch2, opts.hardBlank);
            } else if (opts.fittingRules.hLayout === SMUSHING) {
              piece2 += uni_Smush(ch1, ch2, opts.hardBlank);
            } else {
              var nextCh = "";
              nextCh = !nextCh && opts.fittingRules.hRule1 ? hRule1_Smush(ch1, ch2, opts.hardBlank) : nextCh;
              nextCh = !nextCh && opts.fittingRules.hRule2 ? hRule2_Smush(ch1, ch2, opts.hardBlank) : nextCh;
              nextCh = !nextCh && opts.fittingRules.hRule3 ? hRule3_Smush(ch1, ch2, opts.hardBlank) : nextCh;
              nextCh = !nextCh && opts.fittingRules.hRule4 ? hRule4_Smush(ch1, ch2, opts.hardBlank) : nextCh;
              nextCh = !nextCh && opts.fittingRules.hRule5 ? hRule5_Smush(ch1, ch2, opts.hardBlank) : nextCh;
              nextCh = !nextCh && opts.fittingRules.hRule6 ? hRule6_Smush(ch1, ch2, opts.hardBlank) : nextCh;
              nextCh = nextCh || uni_Smush(ch1, ch2, opts.hardBlank);
              piece2 += nextCh;
            }
          } else {
            piece2 += uni_Smush(ch1, ch2, opts.hardBlank);
          }
        }
        if (overlap >= len2) {
          piece3 = "";
        } else {
          piece3 = txt2.substring(overlap, overlap + Math.max(0, len2 - overlap));
        }
        outputFig[ii] = piece1 + piece2 + piece3;
      }
      return outputFig;
    }
    function newFigChar(len) {
      let outputFigText = [], row;
      for (row = 0;row < len; row++) {
        outputFigText[row] = "";
      }
      return outputFigText;
    }
    const figLinesWidth = function(textLines) {
      return Math.max.apply(Math, textLines.map(function(line, i) {
        return line.length;
      }));
    };
    function joinFigArray(array, len, opts) {
      return array.reduce(function(acc, data) {
        return horizontalSmush(acc, data.fig, data.overlap, opts);
      }, newFigChar(len));
    }
    function breakWord(figChars, len, opts) {
      const result = {};
      for (let i = figChars.length;--i; ) {
        let w = joinFigArray(figChars.slice(0, i), len, opts);
        if (figLinesWidth(w) <= opts.width) {
          result.outputFigText = w;
          if (i < figChars.length) {
            result.chars = figChars.slice(i);
          } else {
            result.chars = [];
          }
          break;
        }
      }
      return result;
    }
    function generateFigTextLines(txt, figChars, opts) {
      let charIndex, figChar, overlap = 0, row, outputFigText, len, height = opts.height, outputFigLines = [], maxWidth, nextFigChars, figWords = [], char, isSpace, textFigWord, textFigLine, tmpBreak;
      outputFigText = newFigChar(height);
      if (opts.width > 0 && opts.whitespaceBreak) {
        nextFigChars = {
          chars: [],
          overlap
        };
      }
      if (opts.printDirection === 1) {
        txt = txt.split("").reverse().join("");
      }
      len = txt.length;
      for (charIndex = 0;charIndex < len; charIndex++) {
        char = txt.substring(charIndex, charIndex + 1);
        isSpace = char.match(/\s/);
        figChar = figChars[char.charCodeAt(0)];
        textFigLine = null;
        if (figChar) {
          if (opts.fittingRules.hLayout !== FULL_WIDTH) {
            overlap = 1e4;
            for (row = 0;row < opts.height; row++) {
              overlap = Math.min(overlap, getHorizontalSmushLength(outputFigText[row], figChar[row], opts));
            }
            overlap = overlap === 1e4 ? 0 : overlap;
          }
          if (opts.width > 0) {
            if (opts.whitespaceBreak) {
              textFigWord = joinFigArray(nextFigChars.chars.concat([
                {
                  fig: figChar,
                  overlap
                }
              ]), height, opts);
              textFigLine = joinFigArray(figWords.concat([
                {
                  fig: textFigWord,
                  overlap: nextFigChars.overlap
                }
              ]), height, opts);
              maxWidth = figLinesWidth(textFigLine);
            } else {
              textFigLine = horizontalSmush(outputFigText, figChar, overlap, opts);
              maxWidth = figLinesWidth(textFigLine);
            }
            if (maxWidth >= opts.width && charIndex > 0) {
              if (opts.whitespaceBreak) {
                outputFigText = joinFigArray(figWords.slice(0, -1), height, opts);
                if (figWords.length > 1) {
                  outputFigLines.push(outputFigText);
                  outputFigText = newFigChar(height);
                }
                figWords = [];
              } else {
                outputFigLines.push(outputFigText);
                outputFigText = newFigChar(height);
              }
            }
          }
          if (opts.width > 0 && opts.whitespaceBreak) {
            if (!isSpace || charIndex === len - 1) {
              nextFigChars.chars.push({ fig: figChar, overlap });
            }
            if (isSpace || charIndex === len - 1) {
              tmpBreak = null;
              while (true) {
                textFigLine = joinFigArray(nextFigChars.chars, height, opts);
                maxWidth = figLinesWidth(textFigLine);
                if (maxWidth >= opts.width) {
                  tmpBreak = breakWord(nextFigChars.chars, height, opts);
                  nextFigChars = { chars: tmpBreak.chars };
                  outputFigLines.push(tmpBreak.outputFigText);
                } else {
                  break;
                }
              }
              if (maxWidth > 0) {
                if (tmpBreak) {
                  figWords.push({ fig: textFigLine, overlap: 1 });
                } else {
                  figWords.push({
                    fig: textFigLine,
                    overlap: nextFigChars.overlap
                  });
                }
              }
              if (isSpace) {
                figWords.push({ fig: figChar, overlap });
                outputFigText = newFigChar(height);
              }
              if (charIndex === len - 1) {
                outputFigText = joinFigArray(figWords, height, opts);
              }
              nextFigChars = {
                chars: [],
                overlap
              };
              continue;
            }
          }
          outputFigText = horizontalSmush(outputFigText, figChar, overlap, opts);
        }
      }
      if (figLinesWidth(outputFigText) > 0) {
        outputFigLines.push(outputFigText);
      }
      if (opts.showHardBlanks !== true) {
        outputFigLines.forEach(function(outputFigText2) {
          len = outputFigText2.length;
          for (row = 0;row < len; row++) {
            outputFigText2[row] = outputFigText2[row].replace(new RegExp("\\" + opts.hardBlank, "g"), " ");
          }
        });
      }
      return outputFigLines;
    }
    const getHorizontalFittingRules = function(layout, options) {
      let props = [
        "hLayout",
        "hRule1",
        "hRule2",
        "hRule3",
        "hRule4",
        "hRule5",
        "hRule6"
      ], params = {}, ii;
      if (layout === "default") {
        for (ii = 0;ii < props.length; ii++) {
          params[props[ii]] = options.fittingRules[props[ii]];
        }
      } else if (layout === "full") {
        params = {
          hLayout: FULL_WIDTH,
          hRule1: false,
          hRule2: false,
          hRule3: false,
          hRule4: false,
          hRule5: false,
          hRule6: false
        };
      } else if (layout === "fitted") {
        params = {
          hLayout: FITTING,
          hRule1: false,
          hRule2: false,
          hRule3: false,
          hRule4: false,
          hRule5: false,
          hRule6: false
        };
      } else if (layout === "controlled smushing") {
        params = {
          hLayout: CONTROLLED_SMUSHING,
          hRule1: true,
          hRule2: true,
          hRule3: true,
          hRule4: true,
          hRule5: true,
          hRule6: true
        };
      } else if (layout === "universal smushing") {
        params = {
          hLayout: SMUSHING,
          hRule1: false,
          hRule2: false,
          hRule3: false,
          hRule4: false,
          hRule5: false,
          hRule6: false
        };
      } else {
        return;
      }
      return params;
    };
    const getVerticalFittingRules = function(layout, options) {
      let props = ["vLayout", "vRule1", "vRule2", "vRule3", "vRule4", "vRule5"], params = {}, ii;
      if (layout === "default") {
        for (ii = 0;ii < props.length; ii++) {
          params[props[ii]] = options.fittingRules[props[ii]];
        }
      } else if (layout === "full") {
        params = {
          vLayout: FULL_WIDTH,
          vRule1: false,
          vRule2: false,
          vRule3: false,
          vRule4: false,
          vRule5: false
        };
      } else if (layout === "fitted") {
        params = {
          vLayout: FITTING,
          vRule1: false,
          vRule2: false,
          vRule3: false,
          vRule4: false,
          vRule5: false
        };
      } else if (layout === "controlled smushing") {
        params = {
          vLayout: CONTROLLED_SMUSHING,
          vRule1: true,
          vRule2: true,
          vRule3: true,
          vRule4: true,
          vRule5: true
        };
      } else if (layout === "universal smushing") {
        params = {
          vLayout: SMUSHING,
          vRule1: false,
          vRule2: false,
          vRule3: false,
          vRule4: false,
          vRule5: false
        };
      } else {
        return;
      }
      return params;
    };
    const generateText = function(fontName, options, txt) {
      txt = txt.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      let lines = txt.split("\n");
      let figLines = [];
      let ii, len, output;
      len = lines.length;
      for (ii = 0;ii < len; ii++) {
        figLines = figLines.concat(generateFigTextLines(lines[ii], figFonts[fontName], options));
      }
      len = figLines.length;
      output = figLines[0];
      for (ii = 1;ii < len; ii++) {
        output = smushVerticalFigLines(output, figLines[ii], options);
      }
      return output ? output.join("\n") : "";
    };
    function _reworkFontOpts(fontOpts, options) {
      let myOpts = JSON.parse(JSON.stringify(fontOpts)), params, prop;
      if (typeof options.horizontalLayout !== "undefined") {
        params = getHorizontalFittingRules(options.horizontalLayout, fontOpts);
        for (prop in params) {
          if (params.hasOwnProperty(prop)) {
            myOpts.fittingRules[prop] = params[prop];
          }
        }
      }
      if (typeof options.verticalLayout !== "undefined") {
        params = getVerticalFittingRules(options.verticalLayout, fontOpts);
        for (prop in params) {
          if (params.hasOwnProperty(prop)) {
            myOpts.fittingRules[prop] = params[prop];
          }
        }
      }
      myOpts.printDirection = typeof options.printDirection !== "undefined" ? options.printDirection : fontOpts.printDirection;
      myOpts.showHardBlanks = options.showHardBlanks || false;
      myOpts.width = options.width || -1;
      myOpts.whitespaceBreak = options.whitespaceBreak || false;
      return myOpts;
    }
    const me = function(txt, options, next) {
      return me.text(txt, options, next);
    };
    me.text = async function(txt, options, next) {
      let fontName = "";
      txt = txt + "";
      if (typeof arguments[1] === "function") {
        next = options;
        options = {};
        options.font = figDefaults.font;
      }
      if (typeof options === "string") {
        fontName = options;
        options = {};
      } else {
        options = options || {};
        fontName = options.font || figDefaults.font;
      }
      return await new Promise((resolve, reject) => {
        me.loadFont(fontName, function(err, fontOpts) {
          if (err) {
            reject(err);
            if (next)
              next(err);
            return;
          }
          const generatedTxt = generateText(fontName, _reworkFontOpts(fontOpts, options), txt);
          resolve(generatedTxt);
          if (next)
            next(null, generatedTxt);
        });
      });
    };
    me.textSync = function(txt, options) {
      let fontName = "";
      txt = txt + "";
      if (typeof options === "string") {
        fontName = options;
        options = {};
      } else {
        options = options || {};
        fontName = options.font || figDefaults.font;
      }
      var fontOpts = _reworkFontOpts(me.loadFontSync(fontName), options);
      return generateText(fontName, fontOpts, txt);
    };
    me.metadata = function(fontName, next) {
      fontName = fontName + "";
      me.loadFont(fontName, function(err, fontOpts) {
        if (err) {
          next(err);
          return;
        }
        next(null, fontOpts, figFonts[fontName].comment);
      });
    };
    me.defaults = function(opts) {
      if (typeof opts === "object" && opts !== null) {
        for (var prop in opts) {
          if (opts.hasOwnProperty(prop)) {
            figDefaults[prop] = opts[prop];
          }
        }
      }
      return JSON.parse(JSON.stringify(figDefaults));
    };
    me.parseFont = function(fontName, data) {
      data = data.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      figFonts[fontName] = {};
      var lines = data.split("\n");
      var headerData = lines.splice(0, 1)[0].split(" ");
      var figFont = figFonts[fontName];
      var opts = {};
      opts.hardBlank = headerData[0].substr(5, 1);
      opts.height = parseInt(headerData[1], 10);
      opts.baseline = parseInt(headerData[2], 10);
      opts.maxLength = parseInt(headerData[3], 10);
      opts.oldLayout = parseInt(headerData[4], 10);
      opts.numCommentLines = parseInt(headerData[5], 10);
      opts.printDirection = headerData.length >= 6 ? parseInt(headerData[6], 10) : 0;
      opts.fullLayout = headerData.length >= 7 ? parseInt(headerData[7], 10) : null;
      opts.codeTagCount = headerData.length >= 8 ? parseInt(headerData[8], 10) : null;
      opts.fittingRules = getSmushingRules(opts.oldLayout, opts.fullLayout);
      figFont.options = opts;
      if (opts.hardBlank.length !== 1 || isNaN(opts.height) || isNaN(opts.baseline) || isNaN(opts.maxLength) || isNaN(opts.oldLayout) || isNaN(opts.numCommentLines)) {
        throw new Error("FIGlet header contains invalid values.");
      }
      let charNums = [], ii;
      for (ii = 32;ii <= 126; ii++) {
        charNums.push(ii);
      }
      charNums = charNums.concat(196, 214, 220, 228, 246, 252, 223);
      if (lines.length < opts.numCommentLines + opts.height * charNums.length) {
        throw new Error("FIGlet file is missing data.");
      }
      let cNum, endCharRegEx, parseError = false;
      figFont.comment = lines.splice(0, opts.numCommentLines).join("\n");
      figFont.numChars = 0;
      while (lines.length > 0 && figFont.numChars < charNums.length) {
        cNum = charNums[figFont.numChars];
        figFont[cNum] = lines.splice(0, opts.height);
        for (ii = 0;ii < opts.height; ii++) {
          if (typeof figFont[cNum][ii] === "undefined") {
            figFont[cNum][ii] = "";
          } else {
            endCharRegEx = new RegExp("\\" + figFont[cNum][ii].substr(figFont[cNum][ii].length - 1, 1) + "+$");
            figFont[cNum][ii] = figFont[cNum][ii].replace(endCharRegEx, "");
          }
        }
        figFont.numChars++;
      }
      while (lines.length > 0) {
        cNum = lines.splice(0, 1)[0].split(" ")[0];
        if (/^0[xX][0-9a-fA-F]+$/.test(cNum)) {
          cNum = parseInt(cNum, 16);
        } else if (/^0[0-7]+$/.test(cNum)) {
          cNum = parseInt(cNum, 8);
        } else if (/^[0-9]+$/.test(cNum)) {
          cNum = parseInt(cNum, 10);
        } else if (/^-0[xX][0-9a-fA-F]+$/.test(cNum)) {
          cNum = parseInt(cNum, 16);
        } else {
          if (cNum === "") {
            break;
          }
          console.log("Invalid data:" + cNum);
          parseError = true;
          break;
        }
        figFont[cNum] = lines.splice(0, opts.height);
        for (ii = 0;ii < opts.height; ii++) {
          if (typeof figFont[cNum][ii] === "undefined") {
            figFont[cNum][ii] = "";
          } else {
            endCharRegEx = new RegExp("\\" + figFont[cNum][ii].substr(figFont[cNum][ii].length - 1, 1) + "+$");
            figFont[cNum][ii] = figFont[cNum][ii].replace(endCharRegEx, "");
          }
        }
        figFont.numChars++;
      }
      if (parseError === true) {
        throw new Error("Error parsing data.");
      }
      return opts;
    };
    me.loadFont = function(fontName, next) {
      if (figFonts[fontName]) {
        next(null, figFonts[fontName].options);
        return;
      }
      if (typeof fetch !== "function") {
        console.error("figlet.js requires the fetch API or a fetch polyfill such as https://cdnjs.com/libraries/fetch");
        throw new Error("fetch is required for figlet.js to work.");
      }
      fetch(figDefaults.fontPath + "/" + fontName + ".flf").then(function(response) {
        if (response.ok) {
          return response.text();
        }
        console.log("Unexpected response", response);
        throw new Error("Network response was not ok.");
      }).then(function(text) {
        next(null, me.parseFont(fontName, text));
      }).catch(next);
    };
    me.loadFontSync = function(name) {
      if (figFonts[name]) {
        return figFonts[name].options;
      }
      throw new Error("synchronous font loading is not implemented for the browser");
    };
    me.preloadFonts = function(fonts, next) {
      let fontData = [];
      fonts.reduce(function(promise, name) {
        return promise.then(function() {
          return fetch(figDefaults.fontPath + "/" + name + ".flf").then((response) => {
            return response.text();
          }).then(function(data) {
            fontData.push(data);
          });
        });
      }, Promise.resolve()).then(function(res) {
        for (var i in fonts) {
          if (fonts.hasOwnProperty(i)) {
            me.parseFont(fonts[i], fontData[i]);
          }
        }
        if (next) {
          next();
        }
      });
    };
    me.figFonts = figFonts;
    return me;
  })();
  if (typeof module !== "undefined") {
    if (typeof exports !== "undefined") {
      module.exports = figlet;
    }
  }
});

// index.ts
var import_figlet = __toESM(require_figlet(), 1);
var server = Bun.serve({
  port: Bun.env.port || 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/")
      return new Response("Home Page!");
    const body = import_figlet.default.textSync("Hello and Welcome to Bun! :D");
    return new Response(body);
  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html"
      }
    });
  }
});
console.log(`Listening on LocalHost yes:${server.port}...`);
