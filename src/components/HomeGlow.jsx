// 內部資源
import ellipse2 from "../assets/images/index_page/光暈/Ellipse_2.svg";
import ellipse3 from "../assets/images/index_page/光暈/Ellipse 3.svg";
import ellipse4 from "../assets/images/index_page/光暈/Ellipse 4.svg";

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
        lightImg: ellipse2,
        altText:"光暈"
    },
    {
        style:{
        position: "absolute",
        top: "-1000px", 
        right: "-1000px", 
        zIndex: "-100"
        },
        lightImg: ellipse4,
        altText:"光暈"
    },
    {
        style:{
        position: "absolute",
        top: "2000px", 
        right: "-1000px", 
        zIndex: "-100"
        },
        lightImg: ellipse3,
        altText:"光暈"
    },
    {
        style:{
        position: "absolute",
        top: "5000px", 
        left: "-900px", 
        zIndex: "-100"
        },
        lightImg: ellipse2,
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