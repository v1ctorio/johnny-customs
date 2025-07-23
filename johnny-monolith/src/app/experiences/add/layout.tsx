import { ModalsProvider } from "@mantine/modals";

export default function ({children}:{children:any}){
	return 					<ModalsProvider>
						{children}
						</ModalsProvider>
}