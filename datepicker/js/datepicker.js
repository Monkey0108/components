class DatePicker {
  constructor() {
    let row = 6;
    let cell = 7;
    let now = new Date(); //当前时间

    this.month_num = 6; //默认设置6个月

    this.gride = new Array(row * cell); //格子数

    //获取当前时间
    this.year = now.getFullYear();
    this.month = now.getMonth() + 1;
    this.day = now.getDate();
    this.week = now.getDay();
    this.sFtv = new Array("0101 元旦","0214 情人节","0308 妇女节","0312 植树节","0401 愚人节","0501 劳动节","0504 青年节","0601 儿童节","0701 建党节","0801 建军节","0910 教师节","1001 国庆节","1006 老人节","1224 平安夜","1225 圣诞节")
  }
  _init() {
    this.setMonth();
    this.setCalendar();
    this.scrollCalendarDate();
  }
  setMonth() {
    let month_container = document.querySelector(".month-container");
    for (let i = 0; i < this.month_num; i++) {
      let month_item = document.createElement("div");
      let span = document.createElement("span");
      let month = this.month + i > 12 ? this.month + i - 12 : this.month + i;
      let year = this.month + i > 12 ? this.year + 1 : this.year;
      let _self = this;
      month_item.className =
        i == 0 ? "month-item month-selected" : "month-item";

      month_item.setAttribute("data-year", year);
      month_item.setAttribute("data-month", month);

      span.innerHTML = month + "月";

      month_item.addEventListener("tap", function() {
        //获取绑定的年和月
        let year = Number(this.getAttribute("data-year"));
        let month = Number(this.getAttribute("data-month"));

        _self.setCalendar(year, month);

        this.parentNode.querySelector(".month-selected").className =
          "month-item";

        this.className = "month-item month-selected";
      });
      month_item.appendChild(span);
      month_container.appendChild(month_item);
    }

    let month_item_width = document.querySelector(".month-item").clientWidth;
    
    month_container.style.width = this.month_num * month_item_width + "px";
    this.scrollMonthBox()
  }
  setCalendar(year = this.year, month = this.month) {
    //根据年月设置日历主体
    document.querySelector(".g-calendar-body .g-calendar-date").innerHTML=""
    let now_year=this.year;
    let start_week = new Date(`${year}/${month}`).getDay();
    
    let day=this.day;//当前天数
    let days = this.getDaysInOneMonth(year,month);//每个月的总天数
    for (let i = 0; i < this.gride.length;i++){
      let date_item=document.createElement('div');
      let extra_info = document.createElement("div");
      let date_info = document.createElement("div");
      let price_info = document.createElement("div");
      date_item.className = "g-calendar-date-item";
      extra_info.className = "extra-info";
      date_info.className = "date-info";
      price_info.className = "price-info";

      if (i < start_week){
        date_item.classList.add("disable");
        date_item.classList.add("empty_day");
        // date_item.className = "g-calendar-date-item ";
      } else{
        date_item.appendChild(extra_info);
        date_item.appendChild(date_info);
        date_item.appendChild(price_info);

        let curr_day = i - start_week+1;
        let day_str = i - start_week + 1;

        let end_day = days;

        let formatFtv = `${month
          .toString()
          .padStart(2, "0")}${curr_day.toString().padStart(2, "0")}`;

        for (let i = 0; i < this.sFtv.length;i++){
          let FtvArray=this.sFtv[i].split(" ");
          if (FtvArray[0]== formatFtv){
            day_str = FtvArray[1];
          }
        }
        if (isNaN(day_str)) {
          date_info.style.fontSize = "14px";
        }

        if (curr_day <= day && now_year===year){
          date_item.classList.add("disable");
          
          date_info.innerHTML = curr_day == day ? '今天' : day_str;

        } else if (curr_day <= end_day){
          
          date_info.innerHTML = day_str;
          price_info.innerHTML = `¥198<i class="price-extra-info">起</i>`;
        }

      }

      document.querySelector(".g-calendar-body .g-calendar-date").appendChild(date_item)
    }
  }
  getDaysInOneMonth(year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);  //这个是都可以兼容的
    var date = new Date(year + "/" + month + "/0")   //IE浏览器可以获取天数，谷歌浏览器会返回NaN
    return d.getDate();
  }
  scrollMonthBox(){
    let month_box = document.querySelector('.month-box')
    let child = month_box.children[0];
    let startX = 0,
      startY = 0,
      startPoint = {},
      minX = month_box.clientWidth - child.offsetWidth;;

    month_box.addEventListener("touchstart", function(e) {
      var touch = e.changedTouches[0];
      startPoint = { pageX: touch.pageX, pageY: touch.pageY };

      startX = cssTransform(child, "translateX");
      startY = cssTransform(child, "translateY");
      child.style.transtion='transform 0 cubic- bezier(0.1, 0.57, 0.1, 1)';
    });
    month_box.addEventListener("touchmove", function(e) {
      var touch = e.changedTouches[0];
      var disX = touch.pageX - startPoint.pageX;
      var disY = touch.pageY - startPoint.pageY;

      if (Math.abs(disX) > Math.abs(disY)) {
        var t = startX + disX;
        if (t > 0) {
          t = 0;
        }
        if (t < minX) {
          t = minX;
        }
        cssTransform(child, "translateX", t);
      }
    });
    month_box.addEventListener("touchend", function(e) {

    });
  }
  scrollCalendarDate(){
    let calendar_date = document.querySelector(".g-calendar-date");
    let startPoint = {}, direct='right',flag=false;
    calendar_date.addEventListener("touchstart", function(e) {
      var touch = e.changedTouches[0];
      startPoint = { pageX: touch.pageX, pageY: touch.pageY };

    });
    calendar_date.addEventListener("touchmove", function(e) {
      var touch = e.changedTouches[0];
      var clientWidth=document.body.clientWidth;
      var disX = touch.pageX - startPoint.pageX;
      var disY = touch.pageY - startPoint.pageY;
      if (Math.abs(disX) < Math.abs(disY)) return
      var percentage=Math.abs(disX) / clientWidth

      if (percentage>0.01){
        flag = true;
        if (disX<0){
          direct='left'
        }else{
          direct = 'right'
        }
      }

    });
    calendar_date.addEventListener("touchend", e=> {
      if(flag){
        let month = Number(document
          .querySelector(".month-item.month-selected")
          .getAttribute("data-month"));
        let year = Number(document
          .querySelector(".month-item.month-selected")
          .getAttribute("data-year"));
        
        let month_items = document.querySelectorAll(".month-container .month-item");
        let currIndex=0;
        for (let i = 0, len = month_items.length; i < len;i++){
          if(month_items[i].classList.contains("month-selected")){
            if ((i == 0 && direct == "right") || i == len - 1 && direct == "left") return
            month_items[i].classList.remove("month-selected");
            currIndex=i;
          }
        }
        

        if(direct == 'left'){
          month_items[currIndex + 1].classList.add("month-selected");
          if (month + 1>12){
            month = month + 1 - 12 ;
            year = year + 1;
          }else{
            month = month + 1
            year = year;
          }
          this.setCalendar(year,month);
        }else{
          month_items[currIndex - 1].classList.add("month-selected");
          if (month - 1 < 1){
            month = 12
            year = year - 1;
          }else{
            month = month - 1;
            year = year;
          }
          this.setCalendar(year, month);
        }
      }
    });
  }
}