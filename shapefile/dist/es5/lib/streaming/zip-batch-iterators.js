"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipBatchIterators = zipBatchIterators;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));

function zipBatchIterators(_x, _x2) {
  return _zipBatchIterators.apply(this, arguments);
}

function _zipBatchIterators() {
  _zipBatchIterators = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee(iterator1, iterator2) {
    var batch1, batch2, iterator1Done, iterator2Done, _yield$_awaitAsyncGen, value, done, _yield$_awaitAsyncGen2, _value, _done, batch;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            batch1 = [];
            batch2 = [];
            iterator1Done = false;
            iterator2Done = false;

          case 4:
            if (!(!iterator1Done && !iterator2Done)) {
              _context.next = 27;
              break;
            }

            if (!(batch1.length === 0 && !iterator1Done)) {
              _context.next = 14;
              break;
            }

            _context.next = 8;
            return (0, _awaitAsyncGenerator2.default)(iterator1.next());

          case 8:
            _yield$_awaitAsyncGen = _context.sent;
            value = _yield$_awaitAsyncGen.value;
            done = _yield$_awaitAsyncGen.done;

            if (done) {
              iterator1Done = true;
            } else {
              batch1 = value;
            }

            _context.next = 21;
            break;

          case 14:
            if (!(batch2.length === 0 && !iterator2Done)) {
              _context.next = 21;
              break;
            }

            _context.next = 17;
            return (0, _awaitAsyncGenerator2.default)(iterator2.next());

          case 17:
            _yield$_awaitAsyncGen2 = _context.sent;
            _value = _yield$_awaitAsyncGen2.value;
            _done = _yield$_awaitAsyncGen2.done;

            if (_done) {
              iterator2Done = true;
            } else {
              batch2 = _value;
            }

          case 21:
            batch = extractBatch(batch1, batch2);

            if (!batch) {
              _context.next = 25;
              break;
            }

            _context.next = 25;
            return batch;

          case 25:
            _context.next = 4;
            break;

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _zipBatchIterators.apply(this, arguments);
}

function extractBatch(batch1, batch2) {
  var batchLength = Math.min(batch1.length, batch2.length);

  if (batchLength === 0) {
    return null;
  }

  var batch = [batch1.slice(0, batchLength), batch2.slice(0, batchLength)];
  batch1.splice(0, batchLength);
  batch2.splice(0, batchLength);
  return batch;
}
//# sourceMappingURL=zip-batch-iterators.js.map