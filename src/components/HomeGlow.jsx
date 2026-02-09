function BGLight(){
    // 光暈資料
    const lightData = [
    {
        style:{
        position: "absolute",
        top: "-650px", 
        left: "-900px", 
        zIndex: "-100"
        },
        lightImg:"https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/bc9a888e21e0148db11348e3dece3ad6595f8262/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%202.svg",
        altText:"光暈"
    },
    {
        style:{
        position: "absolute",
        top: "-1000px", 
        right: "-1000px", 
        zIndex: "-100"
        },
        lightImg:"https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/bc9a888e21e0148db11348e3dece3ad6595f8262/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%204.svg",
        altText:"光暈"
    },
    {
        style:{
        position: "absolute",
        top: "2000px", 
        right: "-1000px", 
        zIndex: "-100"
        },
        lightImg:"https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/bc9a888e21e0148db11348e3dece3ad6595f8262/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%203.svg",
        altText:"光暈"
    },
    {
        style:{
        position: "absolute",
        top: "5000px", 
        left: "-900px", 
        zIndex: "-100"
        },
        lightImg:"https://raw.githubusercontent.com/Jo-Kyu/focus_fitness_project/bc9a888e21e0148db11348e3dece3ad6595f8262/assets/images/index_page/%E5%85%89%E6%9A%88/Ellipse%202.svg",
        altText:"光暈"
    }
    ];
    
    return(
    <>
        {/* 光暈 */}
        {
        lightData.map((light,index)=>(
            <img
            style={light.style}
            src={light.lightImg}
            alt={light.altText}
            key={index}
            />
        ))
        }  
    </>);
}

export default BGLight;