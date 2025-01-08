import type { LayoutServerLoad } from './$types'
import { userAuth } from '$lib/config'


export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {

    if (!userAuth) {
        return {
            session: null,
            cookies: cookies.getAll(),
        }
    }

    const { session } = await safeGetSession()
    return {
        session,
        cookies: cookies.getAll(),
    }

}