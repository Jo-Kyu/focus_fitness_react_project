function PLBGGlow(){
    // 光暈資料

    return(
    <>
        <img
            style={{
            position: "absolute",
            top: "-600px", 
            right: "-800px", 
            zIndex: "-100"  
            }}
            src="https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/9e3f005dfa681ea077f6ee0423e9f1163d0257de/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%202.svg"
            alt="光暈"
        />
        <img
            style={{
                position: "absolute",
                bottom: "-600px",
                left: "-800px",
                zIndex: "-100"
            }}
            src="https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/9e3f005dfa681ea077f6ee0423e9f1163d0257de/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%202.svg"
            alt="光暈"
        />
    </>);
}

export default PLBGGlow;