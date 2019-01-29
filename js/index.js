
fetch('projects.json')
	.then(resp=>resp.json())
	.then(function (data) {
		var html = [];
		var images = [];
		var tags = [];
		var preSelected = ['games', 'web apps', 'math', 'time', 'sql'];
		data.repos.forEach(repo=>{
			tags.push(...repo.tags, repo.type)
			if(repo.logo) images.push(new Promise(d=>{
				var img = new Image();
				img.onload = function(){ d(); };
				img.src = repo.logo;
			}));
			var display = [...repo.tags, repo.type].reduce((acc, cur)=>preSelected.indexOf(cur)>-1?true:acc, false);
			html.push(`<div class="grid-item ${repo.logo && repo.finished ? 'grid-item--width2' : ''}" data-info="${encodeURIComponent(JSON.stringify(repo))}" ${display?'':'style="display:none;"'}>
				<div class="panel panel-default">
					<div class="panel-body">
						<div class="text-center">
							${repo.logo?`<img src="${repo.logo}" class="img-responsive">`:''}
							<h3>${repo.name}</h3>
							<div>
								${repo.tags.map(tag=>`<span class="label label-primary">${tag}</span>`).join(' ')}
								${repo.finished?'':`<span class="label label-danger"><i class="fa fa-exclamation-circle"></i> In Development</span>`}
								<span class="label label-info">${repo.type}</span>
							</div><br>
							<p>${repo.description}</p>
							<div class="btn-group" role="group">
								${repo.repo?`<a href='${repo.repo}' target=_blank class="btn btn-success">Repo</a>`:''}
								${repo.website?`<a href='${repo.website}' target=_blank class="btn btn-info">Website</a>`:''}
							</div>
						</div>
					</div>
				</div>
			</div>`);
		});
		$(".grid").html(html.join(''));
		Promise.all(images).then(()=>{
			$('.grid').masonry({
				itemSelector: '.grid-item',
				columnWidth: 200,
				gutter: 10,
				fitWidth: true
			});
		});
		tags = [...new Set(tags.map(m=>m.toLowerCase().trim()))].sort();
		tags = tags.map(tag=>`<label class="checkbox-inline"><input type="checkbox" class='software-tag-cb' value="${tag}" ${preSelected.indexOf(tag)>-1?'checked':''}>${tag.toUpperCase()}</label>`);
		$(".tag-checkboxes").append(tags.join(''));
	});
	
$(document).on('change', '.software-tag-cb', function(){ console.log("farts");
	var preSelected = [];
	$(".software-tag-cb").each(function(){
		if($(this).is(":checked")) preSelected.push($(this).val());
	});
	$(".grid-item").each(function(){
		var repo = JSON.parse(decodeURIComponent($(this).data('info')));
		var display = [...repo.tags, repo.type].reduce((acc, cur)=>preSelected.indexOf(cur)>-1?true:acc, false);
		$(this)[display?'show':'hide']();
	});
	$('.grid').masonry('layout');
});

$(document).on('click', 'a', function(e){
	var href = $(this).attr('href');
	if(href.substr(0,1) === '#'){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: $(href).offset().top - 55
		}, 2000);
		return false;
	}
});