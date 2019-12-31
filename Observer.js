class Observer{
    constructor(data){
        this.Observe(data);
    }
    Observe(data){
        //要对这个data数据将原有的属性改成set 和 get 的形式
        if(!data || typeof data != 'object'){
            return;
        }
        //要将数据一一劫持 先获取到data 的 key value
        Object.keys(data).forEach(key=>{
            //劫持
            this.defineReactive(data,key,data[key]);
            this.Observe(data[key]);// 深度递归劫持
        })
    }
    //定义响应式
    defineReactive(obj,key,value){
        let that = this;
        let dep = new Dep();// 每个变化的数据 都会对应一个数组 这个数组是存放所有更新的操作
        //在获取某个值的时候，想进行操作
        Object.defineProperty(obj,key,{
            enumerable: true,
            configurable: true,
            get(){
                Dep.target && dep.addSub(Dep.target)
                //当取值时调用的方法
                return value;
            },
            set(newValue){
                //当给data 属性中设置值的时候 更改获取属性的值
                if(newValue != value){
                    that.Observe(newValue);// 如果是对象继续进行劫持
                    value = newValue;
                    dep.notify();//通知所有人 数据更新了 
                } 
            }
        })
    }
}

//发布订阅
class Dep{
    constructor(){
        //订阅的数组
        this.subs = []
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update());
    }
}