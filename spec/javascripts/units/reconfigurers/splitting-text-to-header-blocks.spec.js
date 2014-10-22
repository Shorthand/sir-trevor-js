describe('Formatters.Heading', function() {
  'use strict';

  var Heading = SirTrevor.Formatters.Heading;

  describe("Creating Heading block(s)", function() {

    beforeEach(function() {
      this.element = $('<textarea>').appendTo('body').wrap('<form/>').end();
      this.editor = new SirTrevor.Editor({ el: this.element });
    });

    afterEach(function() {
      this.editor.$form.remove();
      this.editor.destroy();
    });

    describe("Selecting a single (only) paragraph, from the only text block", function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'This is a text section!' }, 0);
        BlockUtils.setSelection(this.editor, 0, 0);
        Heading.onClick();
      });

      it('should have a header block followed by an empty text block', function() {
        expect(this.editor.blocks.length).toBe(2);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a text section!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('');
      });
    });

    describe("Selecting the first paragraph, from the two paragraphs, from this solitary text block", function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'This is the first section that will become a heading block!\n\nThis section will become the second (text) block' }, 0);
        BlockUtils.setSelection(this.editor, 0, 0);
        Heading.onClick();
      });

      it('should have a header block followed by an empty text block', function() {
        expect(this.editor.blocks.length).toBe(2);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is the first section that will become a heading block!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('This section will become the second (text) block');
      });
    });

    describe("Selecting a single paragraph, from the first text block, out of two", function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'This was a text section!' }, 0);
        this.editor.createBlock('text', { text: 'This is a second text section!' }, 1);
        BlockUtils.setSelection(this.editor, 0, 0);
        Heading.onClick();
      });

      it('should have a header block followed by the existing second text block', function() {
        expect(this.editor.blocks.length).toBe(2);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This was a text section!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('This is a second text section!');
      });
    });

    describe("Selecting the single paragraph, from the first text block, followed by a header block", function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'This was a text section!' }, 0);
        this.editor.createBlock('Heading', { text: 'This is a heading section!' }, 1);
        BlockUtils.setSelection(this.editor, 0, 0);
        Heading.onClick();
      });

      it('should have a header block followed by an injected empty text block and then the existing heading block', function() {
        expect(this.editor.blocks.length).toBe(4);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('text');
        expect(BlockUtils.getBlockType(this.editor, 2)).toBe('Heading');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This was a text section!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 2)).toBe('This is a heading section!');
      });
    });

    describe("Selecting across multiple (all) paragraphs, from a single text block", function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'This is a text section!\n\nSecond paragraph' }, 0);
        BlockUtils.setMultiParagraphSelection(this.editor, 0);
        Heading.onClick();
      });

      it('should have two header blocks followed by an empty text block', function() {
        expect(this.editor.blocks.length).toBe(4);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('text');
        expect(BlockUtils.getBlockType(this.editor, 2)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 3)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a text section!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 2)).toBe('Second paragraph');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 3)).toBe('');
      });
    });

    describe("Selecting the second paragraph (containing italics), out of three contained in a single text block", function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'This is a text section!\n\nSecond <i>para</i>graph\n\nThird Paragraph' }, 0);
        BlockUtils.setSelection(this.editor, 0, 2);
        Heading.onClick();
      });

      it('should create a text block followed by a header followed by a text block', function() {
        expect(this.editor.blocks.length).toBe(3);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 2)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a text section!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('Second paragraph');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 2)).toBe('Third Paragraph');
      });
    });

    describe("Selecting the second paragraph, out of three contained in a single text block", function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'This is a text section!\n\nSecond paragraph\n\nThird Paragraph' }, 0);
        BlockUtils.setSelection(this.editor, 0, 2);
        Heading.onClick();
      });

      it('should create a text block followed by a header followed by a text block', function() {
        expect(this.editor.blocks.length).toBe(3);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 2)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a text section!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('Second paragraph');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 2)).toBe('Third Paragraph');
      });
    });

    describe("Selecting the second line, out of three contained in a single text block", function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'This is a text section!\nSecond paragraph\nThird Paragraph' }, 0);
        BlockUtils.setSelection(this.editor, 0, 1);
        Heading.onClick();
      });

      it('should create a text block followed by a header followed by a text block', function() {
        expect(this.editor.blocks.length).toBe(3);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 2)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a text section!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('Second paragraph');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 2)).toBe('Third Paragraph');
      });
    });

    describe("Selecting the 3rd paragraph, out of three contained in a single text block, followed by the 1st paragraph", function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'Soon to be Header 1!\n\nSecond paragraph - always text!\n\nSoon to be Header 2!' }, 0);
      });

      it('should create a heading block followed by a text block, then a heading block', function() {
        BlockUtils.setSelection(this.editor, 0, 4);
        Heading.onClick();
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('Heading');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('Soon to be Header 1!\n\nSecond paragraph - always text!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('Soon to be Header 2!');

        BlockUtils.setSelection(this.editor, 0, 0);
        Heading.onClick();

        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('text');
        expect(BlockUtils.getBlockType(this.editor, 2)).toBe('Heading');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('Soon to be Header 1!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('Second paragraph - always text!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 2)).toBe('Soon to be Header 2!');
      });
    });
  });
});
