(function(SirTrevor, document) {
  'use strict';

  var Heading = SirTrevor.Formatter.extend({

    title: 'heading',
    keyCode: 49,
    text: 'H',

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
        SirTrevor.BlockTransformer.merge(range, block, blockInner, editor);
      } else {
        SirTrevor.BlockTransformer.split(range, block, blockInner, editor, 'Heading');
      }

      SirTrevor.EventBus.trigger("formatbar:hide", editor);
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
        // TODO: Potential bug here if selected block is of the same type?
        return block.getAttribute('data-type') === SirTrevor.Blocks.Heading.prototype.type;
      } else {
        return false;
      }
    }

  });

  SirTrevor.Formatters.Heading = new Heading();

}(SirTrevor, document));
