$.ajax({
	url: "/pie_table",
	type: "POST",
	success: function(reply) {
		if (reply.code === 0) {
			setEchartsPie('table', reply.data, '表信息总览');
		}
	}
})
$.ajax({
	url: "/pie_field",
	type: "POST",
	success: function(reply) {
		if (reply.code === 0) {
			setEchartsPie('field', reply.data, '字段信息总览');
		}
	}
})


function setEchartsPie(id, data, title) {
	let $el = document.getElementById(id);
	let myChart = echarts.init($el, '', {
		
	});
	let dataName = [];
	let total = 0;

	data.forEach((res) => {
		dataName.push(res.name);
		total += parseFloat(res.value) * 10000;
	});
	total = total / 10000;
	option = {
		title: {
			zlevel: 0,
			text: [
				'{value|' + total + '}',
				'{name|' + title + '}',
			].join('\n'),
			rich: {
				value: {
					color: '#303137',
					fontSize: 40,
					fontWeight: 'bold',
					lineHeight: 40,
				},
				name: {
					color: '#909399',
					lineHeight: 20
				},
			},
			top: 50,
			left: 'center',
			textAlign: 'center',
			textStyle: {
				rich: {
					value: {
						color: '#303133',
						fontSize: 40,
						fontWeight: 'bold',
						lineHeight: 40,
					},
					name: {
						color: '#909399',
						lineHeight: 20
					},
				},
			},
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)'
		},
		legend: {
			type: 'scroll',
			orient: 'vertical',
			right: 10,
			top: 20,
			bottom: 20,
			data: dataName,

			// selected: data.selected
		},
		series: [{
			name: '数量',
			type: 'pie',
			radius: '55%',
			center: ['40%', '50%'],
			data: data,
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};
	myChart.setOption(option);
	window.onresize = myChart.resize;
}
