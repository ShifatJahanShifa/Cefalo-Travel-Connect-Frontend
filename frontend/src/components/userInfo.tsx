interface Props {
    username: string 
    imageUrl: string
}

export default function UserInfo ({username, imageUrl}: Props) 
{
    return(
       <div className="flex flex-row gap-3 items-center">
            <img
                src={imageUrl || `/images/none.jpg`}
                alt="profile image"
                className="h-10 w-10 rounded-full border border-slate-300"
            />
            <span>{username}</span>
        </div>
    )
}