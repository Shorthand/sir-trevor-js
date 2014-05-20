(function(SirTrevor, document) {
  'use strict';

  var Quote = SirTrevor.Formatter.extend({

    title: 'quote',
    keyCode: 49,
    text: '“',


    onClick: function() {
      var selection = document.getSelection();
      if (selection.type !== 'Range' || selection.rangeCount === 0) {
        return; // no ranges
      }
      var range = selection.getRangeAt(0);
      var block = this._getSelectedBlock(range);
      var blockInner = block.getElementsByClassName('st-text-block')[0];
      var editor = SirTrevor.getInstance(block.getAttribute('data-instance'));

      if (this.isActive()) {
        SirTrevor.TextAndQuote.merge(range, block, blockInner, editor);
      } else {
        SirTrevor.TextAndQuote.split(range, block, blockInner, editor);
      }
      SirTrevor.EventBus.trigger("formatbar:hide", editor);
    },

    addQuoteBlocks: function(paragraphs, addAt, editor) {
      return SirTrevor.TextAndQuote.addQuoteBlocks(paragraphs, addAt, editor);
    },

    /**
     * Sometimes range containers will be text fragments
     * or HTML elements
     */
    _getRangeContainerElement: function(container) {
      if (container.nodeName === '#text') {
        return container.parentNode;
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

    isActive: function() {
      var selection = document.getSelection();
      if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var block = this._getSelectedBlock(range);
        return block.getAttribute('data-type') === SirTrevor.Blocks.Quote.prototype.type;
      } else {
        return false;
      }
    }

  });

  SirTrevor.Formatters.Quote = new Quote();

}(SirTrevor, document));
