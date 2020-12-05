if (typeof(CKEDITOR) != 'undefined') {
    CKEDITOR.editorConfig = function( config ){
    
      config.uiColor = '#dcf8c6';
      config.height = '100px';  
      config.allowedContent = true;
      config.filebrowserUploadMethod = 'form';
      
      
      config.toolbar = [
        { name: 'styles', items: [ 'Font', 'FontSize' ] },
        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat' ] },
        { name: 'insert', items: ['SpecialChar' ] }
      ];
    };
};  