describe("Reconfiguring blocks", function() {
  'use strict';

  var Heading = SirTrevor.Formatters.Heading;

  describe("Merging back from Heading blocks", function() {

    beforeEach(function() {
      this.element = $('<textarea>').appendTo('body').wrap('<form/>').end();
      this.editor = new SirTrevor.Editor({ el: this.element });
    });

    afterEach(function() {
      this.editor.$form.remove();
      this.editor.destroy();
    });

    describe('merging from a single heading to text block', function() {

      beforeEach(function() {
        this.editor.createBlock('Heading', { text: 'This is a heading!' }, 0);
        BlockUtils.setSelection(this.editor, 0, 0);
        Heading.onClick();
      });

      it('should have one text block', function() {
        expect(this.editor.blocks.length).toBe(1);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
      });
    });

    describe('merging a header block, which is followed by a text block', function() {

      beforeEach(function() {
        this.editor.createBlock('Heading', { text: 'This is a heading!' }, 0);
        this.editor.createBlock('text', { text: 'just text!' }, 1);
        BlockUtils.setSelection(this.editor, 0, 0);
        Heading.onClick();
      });

      it('should have one text block', function() {
        expect(this.editor.blocks.length).toBe(1);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a heading!\njust text!');
      });
    });

    describe('merging a header block, which is followed by an empty text block', function() {

      beforeEach(function() {
        this.editor.createBlock('Heading', { text: 'This is a heading!' }, 0);
        this.editor.createBlock('text', { text: '' }, 1);
        BlockUtils.setSelection(this.editor, 0, 0);
        Heading.onClick();
      });

      it('should have one text block', function() {
        expect(this.editor.blocks.length).toBe(1);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a heading!');
      });
    });

    describe('merging the first out of two header blocks', function() {

      beforeEach(function() {
        this.editor.createBlock('Heading', { text: 'This is a heading!' }, 0);
        this.editor.createBlock('Heading', { text: 'This is a second heading!' }, 1);
        BlockUtils.setSelection(this.editor, 0, 0);
        Heading.onClick();
      });

      it('should have one text block, followed by a heading block', function() {
        expect(this.editor.blocks.length).toBe(2);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('Heading');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a heading!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('This is a second heading!');
      });
    });

    describe('merging the second out of two header blocks', function() {

      beforeEach(function() {
        this.editor.createBlock('Heading', { text: 'This is a heading!' }, 0);
        this.editor.createBlock('Heading', { text: 'This is a second heading!' }, 1);
        BlockUtils.setSelection(this.editor, 1, 0);
        Heading.onClick();
      });

      it('should have one heading block, followed by a text block', function() {
        expect(this.editor.blocks.length).toBe(2);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a heading!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('This is a second heading!');
      });
    });

    describe('merging the second block, where the first is a text block', function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'This is a text block!' }, 0);
        this.editor.createBlock('Heading', { text: 'This is a heading!' }, 1);
        BlockUtils.setSelection(this.editor, 1, 0);
        Heading.onClick();
      });

      it('should have one text block only', function() {
        expect(this.editor.blocks.length).toBe(1);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a text block!\nThis is a heading!');
      });
    });

    describe('merging the second block, where the first is an empty text block', function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: '' }, 0);
        this.editor.createBlock('Heading', { text: 'This is a heading!' }, 1);
        BlockUtils.setSelection(this.editor, 1, 0);
        Heading.onClick();
      });

      it('should have one text block only', function() {
        expect(this.editor.blocks.length).toBe(1);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is a heading!');
      });
    });

    describe('merging the second block, where all 3 blocks are heading blocks', function() {

      beforeEach(function() {
        this.editor.createBlock('Heading', { text: 'This is the first heading!' }, 0);
        this.editor.createBlock('Heading', { text: 'This is the second heading!' }, 1);
        this.editor.createBlock('Heading', { text: 'This is the third heading!' }, 2);
        BlockUtils.setSelection(this.editor, 1, 0);
        Heading.onClick();
      });

      it('should have one text block in the middle surrounded by header blocks', function() {
        expect(this.editor.blocks.length).toBe(3);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('Heading');
        expect(BlockUtils.getBlockType(this.editor, 1)).toBe('text');
        expect(BlockUtils.getBlockType(this.editor, 2)).toBe('Heading');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('This is the first heading!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 1)).toBe('This is the second heading!');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 2)).toBe('This is the third heading!');
      });
    });

    describe('merging the second block, where the first and third are already text blocks', function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'First text block' }, 0);
        this.editor.createBlock('Heading', { text: 'Was a heading!' }, 1);
        this.editor.createBlock('text', { text: 'Second text block' }, 2);
        BlockUtils.setSelection(this.editor, 1, 0);
        Heading.onClick();
      });

      it('should now have one text block only', function() {
        expect(this.editor.blocks.length).toBe(1);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('First text block\nWas a heading!\nSecond text block');
      });
    });

    describe('merging the second block, where the first and third are already text blocks with empty contents in first', function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: '' }, 0);
        this.editor.createBlock('Heading', { text: 'Was a heading!' }, 1);
        this.editor.createBlock('text', { text: 'Second text block' }, 2);
        BlockUtils.setSelection(this.editor, 1, 0);
        Heading.onClick();
      });

      it('should now have one text block only', function() {
        expect(this.editor.blocks.length).toBe(1);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('Was a heading!\nSecond text block');
      });
    });

    describe('merging the second block, where the first and third are already text blocks with empty contents in third', function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: 'First text block' }, 0);
        this.editor.createBlock('Heading', { text: 'Was a heading!' }, 1);
        this.editor.createBlock('text', { text: '' }, 2);
        BlockUtils.setSelection(this.editor, 1, 0);
        Heading.onClick();
      });

      it('should now have one text block only', function() {
        expect(this.editor.blocks.length).toBe(1);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('First text block\nWas a heading!');
      });
    });

    describe('merging the second block, where the first and third are blank text blocks', function() {

      beforeEach(function() {
        this.editor.createBlock('text', { text: '' }, 0);
        this.editor.createBlock('Heading', { text: 'Was a heading!' }, 1);
        this.editor.createBlock('text', { text: '' }, 2);
        BlockUtils.setSelection(this.editor, 1, 0);
        Heading.onClick();
      });

      it('should now have one text block only', function() {
        expect(this.editor.blocks.length).toBe(1);
        expect(BlockUtils.getBlockType(this.editor, 0)).toBe('text');
        expect(BlockUtils.getBlockTextFromPosition(this.editor, 0)).toBe('Was a heading!');
      });
    });
  });
});