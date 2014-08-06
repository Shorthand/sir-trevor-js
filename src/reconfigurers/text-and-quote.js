(function(SirTrevor) {

  var TextAndQuote = SirTrevor.BlockReconfigurer.extend({

    _mergeTextBlocks: function(editor, firstBlock, secondBlock, blockPositionToInsert) {
      // Remove non-editable content before copying
      firstBlock.find('[contenteditable=false]').remove();
      secondBlock.find('[contenteditable=false]').remove();
      var textFromPreviousBlock = this.convertParagraphsToText(firstBlock.find('.st-text-block').children());
      var textFromNewlyCreatedTextBlock = this.convertParagraphsToText(secondBlock.find('.st-text-block').children());

      var textForNewBlock = '';
      if (textFromPreviousBlock.length > 0 && textFromNewlyCreatedTextBlock.length > 0) {
          textForNewBlock = textFromPreviousBlock + '\n\n' + textFromNewlyCreatedTextBlock;
      } else if (textFromPreviousBlock.length === 0 && textFromNewlyCreatedTextBlock.length > 0) {
          textForNewBlock = textFromNewlyCreatedTextBlock;
      } else if (textFromPreviousBlock.length > 0 && textFromNewlyCreatedTextBlock.length === 0) {
          textForNewBlock = textFromPreviousBlock;
      }

      this.addTextBlock(textForNewBlock, blockPositionToInsert, editor);
      editor.removeBlock(firstBlock.attr('id'));
      editor.removeBlock(secondBlock.attr('id'));
    },

    _mergeIfTextBlock: function(editor, blockToCheck, firstBlock, secondBlock, blockPosition) {
      if (this.isTextBlock(blockToCheck)) {
        this._mergeTextBlocks(editor, firstBlock, secondBlock, blockPosition);
      }
    },

    merge: function(range, block, blockInner, editor) {
      var blockPosition = editor.getBlockPosition(block);

      // Remove non-editable content before copying
      $(blockInner).find('[contenteditable=false]').remove();
      //create a text block from the contents of the exisiting quote block
      this.addTextBlock(blockInner.innerText, blockPosition, editor);

      // remove the old quote block
      editor.removeBlock(block.id);

      var totalNumberOfBlocks = editor.blocks.length;
      if (totalNumberOfBlocks === 1) {
        return;
      }
      var newlyCreatedTextBlock = this.getBlockFromPosition(editor, blockPosition);
      var previousBlock = this.getBlockFromPosition(editor, blockPosition - 1);
      var nextBlock = this.getBlockFromPosition(editor, blockPosition + 1);

      if (totalNumberOfBlocks === (blockPosition + 1)) {
        //merge into the block above
        this._mergeIfTextBlock(editor, previousBlock, previousBlock, newlyCreatedTextBlock, blockPosition);
        return;
      }

      if (blockPosition === 0) {
        // if block below is not a quote then merge into it
        this._mergeIfTextBlock(editor, nextBlock, newlyCreatedTextBlock, nextBlock, blockPosition);
      } else {
        // merge top and bottom blocks
        this._mergeIfTextBlock(editor, nextBlock, newlyCreatedTextBlock, nextBlock, blockPosition);
        newlyCreatedTextBlock = this.getBlockFromPosition(editor, blockPosition);
        this._mergeIfTextBlock(editor, previousBlock, previousBlock, newlyCreatedTextBlock, blockPosition);
      }
    },

    consecutiveQuoteBlockCheck: function(editor) {
      var totalNumberOfBlocks = editor.blocks.length;
      var lastButOneBlock = this.getBlockFromPosition(editor, totalNumberOfBlocks - 1);
      var lastBlock = this.getBlockFromPosition(editor, totalNumberOfBlocks - 2);
      if (this.isQuoteBlock(lastButOneBlock) && this.isQuoteBlock(lastBlock)) {
        this.addTextBlock("", totalNumberOfBlocks - 1, editor);
      }
    },

    split: function(range, block, blockInner, editor) {
      var position = editor.getBlockPosition(block) + 1;
      var paragraphsBeforeSelection = this.getParagraphsBeforeSelection(range, blockInner);
      var paragraphsAfterSelection = this.getParagraphsAfterSelection(range, blockInner);
      var newQuotes = this.getSelectedParagraphs(range, blockInner);

      // Remove non-editable content before copying
      $('[contenteditable=false]', paragraphsAfterSelection).remove();

      // Remove the quotes and paragraphs after from the current text block
      this.removeParagraphs([].concat(paragraphsAfterSelection, newQuotes));

      // Add a new quote block for each paragraph that was selected
      position = this.addQuoteBlocks(newQuotes, position, editor);

      // Move text after the selection into a new text block,
      // after the quote block(s) we just created
      var totalNumberOfBlocks = editor.blocks.length;
      var textAfter = this.convertParagraphsToText(paragraphsAfterSelection);
      if (textAfter || ((position) === totalNumberOfBlocks)) {
        this.addTextBlock(textAfter, position, editor);
      }

      // Delete current block if it's now empty
      if (this.isOnlyWhitespaceParagraphs(paragraphsBeforeSelection)) {
        editor.removeBlock(block.id);
      }

      this.consecutiveQuoteBlockCheck(editor);
    }
  });

  /*
   Create our formatters and add a static reference to them
   */
  SirTrevor.TextAndQuote = new TextAndQuote();

}(SirTrevor));
