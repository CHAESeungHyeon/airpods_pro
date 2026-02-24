addEventListener("load", ()=>{
  //스크롤을 내리면 airpods-navbar가 브라우저 상단에 고정
  const navbar = document.querySelector(".airpods-navbar");
    //.airpods-navbar의 y출으로 top위치값을 변수에 할당(44px)
    const originalY = navbar.offsetTop;
    // console.log(originalY)
    //스크롤 이벤트리스너 추가
    addEventListener("scroll", ()=>{
      //스크롤 이동값이 originalY값보다 커지면
      if(scrollY >= originalY){
        navbar.classList.add("sticky");//navbar에 sticky클래스를 추가하여 브라우저 상단에 고정
      }else{//스크롤 이동값이 originalY보다 작으면 
        navbar.classList.remove("sticky");//navbar에 sticky클래스를 제거하여 브라우저 상단에 고정되지 않도록 변경
      }
    })

    //GSAP 플러그인 활용
    //ScrollTrigger 등록
    gsap.registerPlugin(ScrollTrigger);

    //섹션01과 그 내부의 텍스트 요소들을 선택합니다
    const section1 = document.querySelector(".section-01")
    const mainText = document.querySelector(".main-elem")
    const msgText1 = document.querySelector(".msg-elem-01")
    const msgText2 = document.querySelector(".msg-elem-02")
    const msgText3 = document.querySelector(".msg-elem-03")
    const msgText4 = document.querySelector(".msg-elem-04")

    //캔버스 선택과 크기 설정
    const canvas = document.querySelector("#airpods");
    const ctx = canvas.getContext("2d");//캔버스를 2D컨텍스트로 설정
    canvas.width = 1158;
    canvas.height = 770;

    //이미지의 프레임을 저장할 배열을 생성
    const images = [];
    //현재 프레임을 추적하는 airpods객체를 정의
    const airpods = {frame:0}
    //frameCount는 총 프레임의 수를 정의
    const frameCount = 147;

    //프레임 번호를 index로 받아서 이미지 경로를 생성하는 함수
    const currentFrame = (index)=>{
      //index가 0일 경우 `assets/images/airpods/0001.jpg
      return `assets/images/airpods/${(index+1).toString().padStart(4,"0")}.jpg`;
      //padStart(글자수, 빈자리를 채울 문자)
    }
    // console.log(currentFrame(111))
    // 총 프레임의 갯수 만큼 반복
    for(let i = 0; i < frameCount; i++){
      const img = new Image(); //이미지 객체를 생성
      img.src = currentFrame(i); //이미지 경로를 생성하는 함수를 호출하여 생성한 이미지의 src속성값을 할당
      images.push(img);//images배열에 생성한 이미지를 저장
      //img 객체의 load이벤트 핸들러를 정의(이미지가 로드 되었을때 호출)
      img.addEventListener("load", () => {
        //첫번째 이미지가 로드되면 render함수를 호출 (render함수는 이미지를 캔버스에 그려줄 함수)
        if(i === 0) render()
      })
    } 
    // console.log(images)

    //초기 로딩 애니메이션
    let tl0 = gsap.timeline()//timeline메서드를 호출

    //타임라인에 "start0"이라는 레이블 추가
    //이후에 .to()메서드에 3번째 인자값으로 "start0"을 입력하면 해당 애니메이션은 동시에 실행됩니다.
    tl0
    .add("start0")
    //"start0"지점에서 캔버스가 2초동안 서서히 보이게 합니다.
    .fromTo(
      canvas,
      {opacity:0}, 
      {duration:2, opacity:1},
      "start0"
    )
    //"start0"지점에서 mainText를 0.75초 기다렸다 1.5초동안 서서히 보이게 합니다
    .fromTo(
      mainText,
      {opacity:0},
      {duration:1.5, delay:0.75, opacity:1},
      "start0"
    )

    //스크롤 애니메이션을 정의하기 위해 타임라인 객체를 생성
    const tl1 = gsap.timeline({
      scrollTrigger:{//스크롤 이벤트에 따라 애니메이션을 제어하기 위한 설정
        trigger:section1, //스크롤에 의해 트리거될 요소
        start: "top top+=10px",//애니메이션이 시작되는 지점
        //"section1의 상단 뷰포트 상단에서 10픽셀 아래지점"
        end:"+=4000",//애니메이션 종료지점
        scrub:true,//스크롤 위치에 따라 애니메이션 동기화
        pin:true,//트리거 요소를 고정시킴
        markers:true
      }
    })
    tl1
    .add("start0")
    //메인 텍스트 애니메이션: 5초동안 위로 500px이동
    .to(
      mainText,
      {duration:5, y:-500, ease:"power2.out"},
      "start0"
    )
    //airpods객체의 frame속성을 0에서 138까지 8초동안 애니메이션 합니다
    .to(
      airpods,
      {
        duration:8,
        frame:138,
        snap:"frame",//애니메이션을 프레임 단위로 스냅합니다.(이미지를 담아준다)
        ease: "none",//가감속 적용안함
        onUpdate: render,//프레임이 변경될때 render함수를 호출(캔버스에 이미지를 그려주는 함수)
      },
      "start0"
    )

    .add("start1")
    //msgText1요소 : 3.5초동안 투명도가 1로 증가하고 y축으로 -50px위치로 이동한 후, 다시 3.5초 동안 투명도가 0으로 감소하고 현재위치(-50px)에서 y축으로 -100px로 이동
    .to(
      msgText1,
      {duration: 3.5, opacity:1, y: -50},
      "start1"
    )
    .to(
      msgText1,
      {duration:3.5, opacity:0, y:-100}
    )
    //나머지 텍스트에 대한 애니메이션 설정은 msgText1과 동인
    .add("start2")
    .to(msgText2,{duration: 3.5, opacity:1, y: -50},"start2")
    .to(msgText2,{duration:3.5, opacity:0, y:-100})
    
    .add("start3")
    .to(msgText3,{duration: 3.5, opacity:1, y: -50},"start3")
    .to(msgText3,{duration:3.5, opacity:0, y:-100})

    .add("start4")
    .to(msgText4,{duration: 3.5, opacity:1, y: -50},"start4") 
    .to(msgText4,{duration:3.5, opacity:0, y:-100})

    //airpods의 frame속성을 마지막 프레임까지 1초동안 애니메이션 합니다.
    .to(
      airpods,
      {
        duration: 1,
        frame: frameCount -1,
        snap: "frame",
        ease: "power2.out",
        onUpdate:render
      }
    )
    //캔버스의 크기를 36초동안 0.5배로 축소합니다.
    .to(
      canvas,
      {duration:36, scale:0.5, ease:"power1.in"},
      "start0"
    )


    //render함수는 캔버스를 지우고 현재 프레임의 이미지를 캔버스에 그려줍니다
    function render(){
      //캔버스 전체 영역을 지워줍니다
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      //캔버스에 이미지를 표시(이미지요소, x축 위치, y축 위치)
      ctx.drawImage(images[airpods.frame], 0, 0)
    }
// ========section-02===========================
    //section02와 그 내부의 텍스트요소를 선택합니다
    const section2 = document.querySelector(".section-02");
    const msgText = section2.querySelector(".msg-elem");
    //캔버스 요소를 선택하고 2d랜더링 컨텍스트를 ctx2에 할당
    const canvas2 = document.querySelector("#head-bob-turn");
    const ctx2 = canvas2.getContext("2d");
    
    //캔버스 크기 설정
    canvas2.width = 1458;
    canvas2.height = 820;

    //이미지의 프레임을 저장할 배열
    const images2 = [];
    //현재 프레임을 추적하는 headturn객체를 정의
    const headturn = {frame: 0};
    //frameCount2는 총 프레임의 수를 정의
    const frameCount2 = 131;

    //프레임 번호를 index로 받아서 이미지 경로를 생성하는 함수
    const currentFrame2 = (index)=>{
      //index가 0일 경우 `assets/images/head-bob-turn/0001.jpg
      return `assets/images/head-bob-turn/${(index+1).toString().padStart(4,"0")}.jpg`;
    }
    // 총 프레임의 갯수 만큼 반복
    for(let i = 0; i < frameCount2; i++){
      const img = new Image(); 
      img.src = currentFrame2(i); 
      images2.push(img);
      img.addEventListener("load", () => {
        if(i === 0) render2()
      })
    } 

    //로딩 애니메이션을 정의하기 위해 gsap.timeline()을 호출하여 타임라인 객체를 생성
    let tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: section2,
        start:"top top",
        end:"+=4000",
        scrub: true,
        pin: true,
      }
    })

    tl2
    //start0 지점에서 msgText를 11초 지연 후 3.5초 동안 불투명도 1로 설정, y축으로 -50px 이동시킵니다.
      .add("start0")
      .to(
        msgText,
        {delay:11, duration:3.5, opacity:1, y: -50},
        "start0"
      )
      .to(msgText, {duration:3.5, opacity:0, y: -100})

      //headturn 객체의 frame 속성을 0에서 마지막 프레임까지 19초동안 애니메이션 합니다
      .to(
        headturn,
        {
          duration: 19,
          frame: frameCount2 - 1,
          snap:"frame",
          ease: "none",
          onUpdate: render2//프레임이 변경될때 render함수를 호출
        },
        "start0"
      )

      //render2 함수는 캔버스를 지우고 현재 프레임의 이미지를 캔버스에 그립니다.
      function render2(){
        ctx2.clearRect(0,0,canvas2.width, canvas2.height);
        ctx2.drawImage(images2[headturn.frame], 0, 0)
      }
})