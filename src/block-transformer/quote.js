(function(SirTrevor) {

  var Quote = SirTrevor.BlockTransformer.extend({

    split: function(range, block, blockInner, editor) {
      var position = editor.getBlockPosition(block);
      var paragraphsAfterSelection = this.getParagraphsAfterSelection(range, blockInner);
      var newQuotes = this.getSelectedParagraphs(range, blockInner);
      var paragraphsBeforeSelection = this.getWholeParagraphsBeforeSelection(range, blockInner);

      // Remove non-editable content before copying
      $('[contenteditable=false]', paragraphsAfterSelection).remove();
      $('[contenteditable=false]', newQuotes).remove();

      // Remove the quotes and paragraphs after from the current text block
      this.removeParagraphs([].concat(paragraphsAfterSelection, newQuotes));

      // if paragraphs exist before this new styled block that is going to be added then insert after this paragraph
      if (paragraphsBeforeSelection.length !== 0){
        position++;
      }

      // Add a new quote block for each paragraph that was selected
      position = this.addQuoteBlocks(newQuotes, position, editor);

      // Move text after the selection into a new text block,
      // after the quote block(s) we just created
      if (paragraphsAfterSelection.length !== 0) {
        var textAfter = this.convertParagraphsToText(paragraphsAfterSelection);
        if (textAfter) {
          this.addTextBlock(textAfter, position, editor);
        }
      }

      // Delete current block if it's now empty
      if (this.isOnlyWhitespaceParagraphs(blockInner.children)) {
        editor.removeBlock(block.id);
      }

      this.ensureNoConsecutiveStyledBlocks(editor);
      this.ensureLastBlockIsText(editor);
    }

  });

  /*
   Create our formatters and add a static reference to them
   */
  SirTrevor.BlockTransformers.Quote = new Quote();

}(SirTrevor));
