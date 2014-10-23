SirTrevor.BlockReconfigurer = (function() {

  var Reconfigurer = function(options) {
    this.initialize.apply(this, arguments);
  };

  _.extend(Reconfigurer.prototype, {

    WHITESPACE_AND_BR: new RegExp('^(?:\s*<br\s*/?>)*\s*$', 'gim'),

    /**
     * These constant are few use with Range.comparePoint
     * https://developer.mozilla.org/en-US/docs/Web/API/range.comparePoint
     */
    TEXT_BEFORE: -1,
    TEXT_AFTER: 1,

    initialize: function() {
    },

    isTextBlock: function(block) {
      return block.data().type === SirTrevor.Blocks.Text.prototype.type;
    },

    isHeadingBlock: function(block) {
      return block.data().type === SirTrevor.Blocks.Heading.prototype.type;
    },

    isQuoteBlock: function(block) {
      return block.data().type === SirTrevor.Blocks.Quote.prototype.type;
    },

    isStyledBlock: function(block) {
      return this.isQuoteBlock(block) || this.isHeadingBlock(block);
    },

    getBlockFromPosition: function(editor, position) {
      return editor.$wrapper.find('.st-block').eq(position);
    },

    removeParagraphs: function(paragraphs) {
      _.each(paragraphs, function(p) {
        p.parentNode.removeChild(p);
      });
    },

    _addBlocks: function(paragraphs, addAt, editor, blockType) {
      _.each(paragraphs, function(paragraph) {
        // Ignore whitespace and <br> "paragraphs"
        if (paragraph.innerHTML.match(this.WHITESPACE_AND_BR) === null) {
          editor.createBlock(blockType, { text: paragraph.innerHTML }, addAt);
          addAt += 1; // increment index to account for each block
        }
      }, this);

      return addAt;
    },

    addHeadingBlocks: function(paragraphs, addAt, editor) {
      return this._addBlocks(paragraphs, addAt, editor, 'Heading');
    },

    addQuoteBlocks: function(paragraphs, addAt, editor) {
      return this._addBlocks(paragraphs, addAt, editor, 'Quote');
    },

    /**
     * Convert an array of block elements into a
     * markdown-like string
     */
    convertParagraphsToText: function(paragraphs) {
      return _.chain(paragraphs)
          .filter(function(p) {
            return p.innerHTML.match(this.WHITESPACE_AND_BR) === null;
          }, this)
          .map(function(p) {
            return p.innerHTML;
          })
          .value() // get filtered array
          .join('\n\n'); // to string;
    },

    isOnlyWhitespaceParagraphs: function(paragraphs) {
      return _.every(paragraphs, function(p) {
        return p.innerHTML.match(this.WHITESPACE_AND_BR) !== null;
      }, this);
    },

    addTextBlock: function(text, addAt, editor) {
      return editor.createBlock('Text', { text: text }, addAt);
    },

    /**
     * Examines the current selection and retrieves any
     * wholly or partially selected paragraphs
     */
    getSelectedParagraphs: function(range, blockInner) {
      var startContainer = this._getRangeContainerElement(range.startContainer);
      var endContainer = this._getRangeContainerElement(range.endContainer);

      if (startContainer === endContainer) {
        return [startContainer];
      }

      var paragraphs = [startContainer];

      var otherParagraphs = _.filter(blockInner.children, function(el) {
        return range.comparePoint(el, 0) === 0;
      });

      paragraphs = paragraphs.concat(otherParagraphs, endContainer);

      return _.unique(paragraphs);
    },

    /**
     * Return all the paragraphs that are after
     * the selection the text block
     */
    getParagraphsAfterSelection: function(range, blockInner) {
      return this._getParagraphsRelativeToRange(range, this.TEXT_AFTER, blockInner);
    },

    /**
     * Return all the paragraphs that are before
     * the selection the text block
     */
    getParagraphsBeforeSelection: function(range, blockInner) {
      return this._getParagraphsRelativeToRange(range, this.TEXT_BEFORE, blockInner);
    },

    getWholeParagraphsBeforeSelection: function(range, blockInner) {
      var text = Array.prototype.filter.call(blockInner.children, function(child) {
        var childRange = document.createRange();
        childRange.selectNode(child)
        return range.compareBoundaryPoints(Range.END_TO_START, childRange) === 1;
      }.bind(this));
      return text;
    },

    /**
     * Position integer:
     *  1 - After
     * -1 - Before
     *
     * See here: https://developer.mozilla.org/en-US/docs/Web/API/range.comparePoint
     */
    _getParagraphsRelativeToRange: function(range, position, blockInner) {
      var text = Array.prototype.filter.call(blockInner.children, function(child) {
        return range.comparePoint(child, 0) === position;
      }.bind(this));

      return text;
    },

    /**
     * Sometimes range containers will be text fragments
     * or HTML elements
     */
    _getRangeContainerElement: function(container) {
      if (container.nodeName !== 'DIV') {
        if (container.parentNode.nodeName !== 'DIV') {
          return this._getRangeContainerElement(container.parentNode)
        }
        container = container.parentNode;
      }

      return container;
    },

    _getSelectedBlock: function(range) {
      var block = this._getRangeContainerElement(range.startContainer);
      while (!block.classList.contains('st-block')) {
        block = block.parentNode;
      }
      return block;
    },

    ensureLastBlockIsText: function(editor) {
      var totalNumberOfBlocks = editor.blocks.length;
      if (totalNumberOfBlocks > 0) {
        var lastBlock = this.getBlockFromPosition(editor, totalNumberOfBlocks - 1);
        if (this.isStyledBlock(lastBlock)) {
          this.addTextBlock("", totalNumberOfBlocks, editor);
        }
      }
    },

    ensureNoConsecutiveStyledBlocks: function(editor) {
      var totalNumberOfBlocks = editor.blocks.length;
      var currentBlockPosition = 0;
      while (currentBlockPosition < (totalNumberOfBlocks - 1)) {
        var block = this.getBlockFromPosition(editor, currentBlockPosition);
        var nextBlock = this.getBlockFromPosition(editor, currentBlockPosition + 1);
        if (this.isStyledBlock(block) && this.isStyledBlock(nextBlock)) {
          this.addTextBlock("", currentBlockPosition + 1, editor);
          totalNumberOfBlocks = editor.blocks.length;
        }
        currentBlockPosition++;
      }
    }

  });

  Reconfigurer.extend = extend; // Allow our reconfigurer to be extended.

  return Reconfigurer;

})();
