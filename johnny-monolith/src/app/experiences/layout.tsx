import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function experiencesLayout({children}:{children:any}){
    return <>
              <Header active="experiences"/>
              {children}
              <Footer />
    </>
}