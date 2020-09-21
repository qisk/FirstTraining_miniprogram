// Event库已修改，解决多次emit时，有些监听会失效的问题。
// 详见http://localhost:88/web/#/70?page_id=1693 - 调试过程中出现的问题
class Event {
	cache;
	constructor() {
		this.cache = {};
	}
	on(key, func) {
		(this.cache[key] || (this.cache[key] = [])).push(func);
	}
	// apply、call、bind差别
	once(key, func) {
		function on() {
			this.off_process(key, on, false);
			func.apply(this, arguments);
		}
		this.on.apply(this, [key, on]);
	}
	offbak(key) {
		// 这个实现不完整，使用下面新的off实现
		this.cache[key] = null;
	}

	off_process(key, func, splice) {
		if (func) {
			let stack = this.cache[key];
			if (stack && stack.length > 0) {
				for (let j = 0; j < stack.length; j++) {
					if (stack[j] == func) {
						if (splice == true) {
							stack.splice(j, 1);
						} else {
							stack[j] = null;
							console.log('stack[j] is null', stack[j]);
						}
						break;
					}
				}
			}
		} else {
			delete this.cache[key];
		}
	}

	off(key, func) {
		this.off_process(key, func, true);
	}

	emit(key, ...args) {
		const stack = this.cache[key];
		if (stack && stack.length > 0) {
			// 执行监听函数
			stack.forEach(item => {
				if (item != null) {
					item.apply(this, args)
				}
			});
			console.log('emit1:stack.length=', stack.length);
			
			// 从后往前遍历数组，将设置为null的元素删除		
			for (let i = stack.length - 1; i >= 0; i--) {
				if (stack[i] == null) {
					console.log('stack.splice', i);
					stack.splice(i, 1);
				}
			}
			console.log('emit2:stack.length=', stack.length);
		}
	}
}

export default Event;