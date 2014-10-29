(function(SirTrevor) {

  var TextAndHeader = SirTrevor.BlockTransformer.extend({

    split: function(range, block, blockInner, editor) {
      var position = editor.getBlockPosition(block);
      var paragraphsAfterSelection = this.getParagraphsAfterSelection(range, blockInner);
      var selectedParagraphs = this.getSelectedParagraphs(range, blockInner);
      var paragraphsBeforeSelection = this.getWholeParagraphsBeforeSelection(range, blockInner);

      // Remove non-editable content before copying
      $('[contenteditable=false]', paragraphsAfterSelection).remove();
      $('[contenteditable=false]', selectedParagraphs).remove();

      // Remove the headings and paragraphs after from the current text block
      this.removeParagraphs([].concat(paragraphsAfterSelection, selectedParagraphs));

      // if paragraphs exist before this new styled block that is going to be added then insert after this paragraph
      if (paragraphsBeforeSelection.length !== 0){
        position++;
      }
      // Add a new heading block for each paragraph that was selected
      position = this.addHeadingBlocks(selectedParagraphs, position, editor);

      if (paragraphsAfterSelection.length !== 0) {
        var textAfter = this.convertParagraphsToText(paragraphsAfterSelection);
        if (textAfter) {
          this.addTextBlock(textAfter, position, editor);
        }
      }
      // Delete original block if it's now empty
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
  SirTrevor.TextAndHeader = new TextAndHeader();

}(SirTrevor));
