'use client'

import { Avatar, Group, StylesApiProps, Text, UnstyledButton, UnstyledButtonProps, UnstyledButtonStylesNames } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import classes from './SlackUserButton.module.css';
export interface CachetUserData {
	id:string;
	expiration:string;
	user:string;
	displayName:string;
	pronouns:string;
	image:string;
}

interface SlackUserButtonProps extends UnstyledButtonProps {
	uID: string;
	catMode?:boolean;
}

export function SlackUserButton({uID, catMode = false, styles}:SlackUserButtonProps) {
	const [user, setUser] = useState<CachetUserData|null>(null)
	
	
	useEffect(()=>{
		fetch("https://cachet.dunkirk.sh/users/"+uID)
		.then(r=>r.json())
		.then(u=>{
			setUser(u)
		})
	},[])


	return <UnstyledButton className={`${classes.button} ${classes.user}`} styles={styles} component="a" target="_blank" rel="noopener noreferrer" href={"https://hackclub.slack.com/team/"+uID}>
		<Group >
			<Avatar variant="filled" src={ catMode ? "https://placecats.com/300/300" : user ? user.image ? user.image : "https://avatars.githubusercontent.com/u/10137?v=4" : ""}/>
			        <div style={{ flex: 1 }}>
    <div
      className={user && user?.displayName?.length > 15 ? classes.marquee : classes.singleLine}
      
    >
          <Text size="sm" fw={500} component="span">
            {user ? user.displayName ? user.displayName : "Ghost" : "Slack user"}
          </Text>
</div>
          <Text c="dimmed" size="xs">
            {uID}
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
		</Group>
	</UnstyledButton>
}