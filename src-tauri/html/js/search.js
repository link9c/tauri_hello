$("#select").blur(function() {
	let target = $("#select").find("option:selected").attr('value');
	$.ajax({
		url: "/search",
		type: "POST",
		data: {
			value: target
		},
		success: function(reply) {
			if (reply.code === 0) {
				let l = $("#targetlist");
				l.empty()
				for (var i = 0; i < reply.data.length; i++) {
					let opt = "<option>" + reply.data[i] + "</option>"

					l.append(opt)
				}

			}
		}
	})
})



$('#target').blur(function() {
	let v = $('#target').val();
	console.log(v)
	$.ajax({
		url: "/target_value",
		type: "GET",
		type: "GET",
		data: {
			target: v
		},
		success: function(reply) {
			if (reply.code === 0) {
				let l = $("#valuelist");
				l.empty()
				for (var i = 0; i < reply.data.length; i++) {
					let opt = "<option>" + reply.data[i] + "</option>"
					l.append(opt)
				}
			}
		}
	})
});


$('#search_btn').click(function() {
	let on_list = [];
	$.each($('input[type=checkbox]:checked'), function() {
		on_list.push($(this).val());
	});


	let target = $('#target').val();
	let t_value = $('#target_value').val();
	let stamp = $('#timeStamp').val();
	$.ajax({
		url: "/search",
		type: "POST",
		data: {
			target: target,
			t_value: t_value,
			stamp: stamp,
			on_list: on_list
		},
		success: function(reply) {
			if (reply.code === 1002 || reply.code === 1003) {
				console.log('ok')
				$('.error').html('')
				window.open(reply.url)

			} else if (reply.code === 1001 || reply.code === 1000) {
				$('.error').html('未找到信息')
			}
		}
	})
});
