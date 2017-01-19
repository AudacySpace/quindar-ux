function filterText()
	{  
		var rex = new RegExp($('#filterText').val());
		if(rex =="/CATEGORY/"){clearFilter()}else{
			$('.content').hide();
			$('.content').filter(function() {
			return rex.test($(this).text());
			}).show();
	}
	}
	
function clearFilter()
	{
		$('#filterText').val('CATEGORY');
		$('.content').show();
	}