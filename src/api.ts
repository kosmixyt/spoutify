import type { AlbumData, Artist, MainArtist, SearchItem, SearchResult, Thumbnail } from "./type"

const app_url = "http://127.0.0.1:8000"

export var token = ""
export async function getToken(): Promise<string> {
    const res = await fetch(`${app_url}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username: "user@example.com",
            password: "password123",
        })
    })

    const data = await res.json()
    if (data.error) {
        throw new Error(data.error)
    }
    if (data.access_token) {
        token = data.access_token
    }
    return data.access_token;
}


export async function GetArtist(id: string): Promise<MainArtist> {
    const res = await fetch(`${app_url}/artist/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    const data = await res.json()
    if (data.error) {
        throw new Error(data.error)
    }
    return data as MainArtist
}


export function getLargestThumbnail(thumbnails: Thumbnail[]): string {
    let largest = 0
    let largestUrl = ""
    for (const thumbnail of thumbnails) {
        if (thumbnail.width > largest) {
            largest = thumbnail.width
            largestUrl = thumbnail.url
        }
    }
    return largestUrl
}
export async function GetAlbum(id: string) {
    const res = await fetch(`${app_url}/album/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    const data = await res.json()
    if (data.error) {
        throw new Error(data.error)
    }
    return data as AlbumData
}
export function getBestQualitythumbnail(thumbnails: Thumbnail[]): Thumbnail {
    let largest = 0
    let largestUrl = ""
    let largestThumbnail: Thumbnail = { url: "", width: 0, height: 0 }
    for (const thumbnail of thumbnails) {
        if (thumbnail.width > largest) {
            largest = thumbnail.width
            largestUrl = thumbnail.url
            largestThumbnail = thumbnail
        }
    }
    return largestThumbnail
}
export async function Search(query: string, filter: string): Promise<SearchItem[]> {
    const res = await fetch(`${app_url}/search?query=${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    const data = await res.json()
    if (data.error) {
        throw new Error(data.error)
    }
    return data as SearchItem[]
}