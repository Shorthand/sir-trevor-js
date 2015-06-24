describe("Removing and merging blocks on the Editor", function(){

  var element, editor;

  beforeEach(function(){
    SirTrevor.instances = [];
    element = $('<textarea>').appendTo('body').wrap('<form/>').end();
    this.editor = new SirTrevor.Editor({ el: element, defaultType: false });

    this.editor.createBlock('Text');
    this.editor.createBlock('Heading');
    this.editor.createBlock('Text');
    this.editor.createBlock('Quote');
    this.editor.createBlock('Heading');
  });

  it("removes the block from the blocks array and merges the surrounding text blocks", function(){
    this.editor.removeAndMergeBlocks(this.editor.blocks[1].blockID);
    expect(this.editor.blocks.length).toBe(3); // Text, Quote, Heading
  });

  it("removes the block from the blocks array and doesn't merge if not surrounded by text blocks", function(){
    this.editor.removeAndMergeBlocks(this.editor.blocks[3].blockID);
    expect(this.editor.blocks.length).toBe(4);
  });

  describe("When there is only two blocks", function() {

    beforeEach(function() {
      this.editor = new SirTrevor.Editor({ el: element, defaultType: false });
      this.editor.createBlock('Text');
      this.editor.createBlock('Quote');
    });

    it("removes the block from the blocks array and doesnt attempt merge", function() {
      this.editor.removeAndMergeBlocks(this.editor.blocks[1].blockID);
      expect(this.editor.blocks.length).toBe(1);
    });
  });
});
