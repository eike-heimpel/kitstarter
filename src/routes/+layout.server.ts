import type { LayoutServerLoad } from './$types'
import { userAuth } from '$lib/config'


export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {

    if (!userAuth) {
        return {
            session: null,
            cookies: cookies.getAll(),
        }
    }

    try {
        const { session } = await safeGetSession()
        return {
            session,
            cookies: cookies.getAll(),
        }
    } catch (error) {
        // If session fetch fails, return null session but preserve cookies
        return {
            session: null,
            cookies: cookies.getAll(),
        }
    }
}