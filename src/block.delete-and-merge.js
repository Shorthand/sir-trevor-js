SirTrevor.BlockDeleteAndMerge = (function(){

  var BlockDeleteAndMerge = function() {
    this._ensureElement();
    this._bindFunctions();
  };

  _.extend(BlockDeleteAndMerge.prototype, FunctionBind, Renderable, {

    tagName: 'a',
    className: 'delete-and-merge',

    attributes: {
      html: '<svg xmlns="http://www.w3.org/2000/svg" class="iconic-x injected-svg iconic iconic-sm iconic-main" width="16" height="16" viewBox="0 0 128 128">  <g class="iconic-metadata">    <title>X</title>  </g>  <g data-width="16" data-height="16" class="iconic-x-sm iconic-container iconic-sm" transform="scale(8)">    <path stroke="#000" stroke-width="4" stroke-linecap="square" class="iconic-property-stroke" d="M3 3l10 10m0-10l-10 10" fill="none"></path>  </g></svg>'
    }

  });

  return BlockDeleteAndMerge;

})();