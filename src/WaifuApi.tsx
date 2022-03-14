export interface Tag{
    description: string,
    id: number;
    is_nsfw:true;
    name: string
}

interface Image{
    file: string,
    extension: string,
    image_id: number,
    dominant_color: string,
    source: string,
    like: number,
    uploaded_at: string,
    is_nsfw: boolean,
    url: string,
    tags: Tag[]
}

function getTags(): Promise<any>{
    return fetch("https://api.waifu.im/tags/?full=on")
    .then(response => response.json())
}


export function getSfwTags(): Promise<Tag[]>{
    return getTags().then((data:any) => data.versatile); 
}
export function getNsfwTags(): Promise<Tag[]>{
    return getTags().then((data:any) => data.nsfw)
}
export function getAllTags(): Promise<Tag[]>{
    return getTags().then((data:any) => data.versatile.concat(data.nsfw))
}

export function getRandomImages(
    selected_tags?: string[],
    excluded_tags?: string[],
    is_nsfw?: Boolean,
    gif?: Boolean,
    order_by?: "FAVORITES" | "UPLOADED_AT",
    many = true,
    excluded_files?: string[]
) : Promise<Image[]>{
    let url = "https://api.waifu.im/random/?";
    selected_tags?.forEach(tag => url += `&selected_tags=${tag}`);
    excluded_tags?.forEach(tag => url += `&excluded_tags=${tag}`);
    url += "&many=true"
    return fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.code == 404){
            console.log(`An 404 error occured, message=${data.message}`);
            return [];
        }
        return data.images
    });
}