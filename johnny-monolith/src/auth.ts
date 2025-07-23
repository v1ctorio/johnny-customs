import NextAuth from "next-auth"
import Slack from "next-auth/providers/slack"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
		Slack
	],
	callbacks: {
		async jwt({token,profile}){
			if (profile?.sub) {
			token.id = profile.sub
			}
			return token
		}
		,
		async session({session,token}) {
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string
				}
			}
		},

	},
	debug: true,
})