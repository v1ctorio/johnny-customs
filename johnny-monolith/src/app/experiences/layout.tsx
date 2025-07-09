import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function experiencesLayour({children}:{children:any}){
    return <>
              <Header active="experiences"/>
              {children}
              <Footer />
    </>
}