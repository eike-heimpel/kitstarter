import { PUBLIC_AUTH_ENABLED } from '$env/static/public'

export const userAuth = PUBLIC_AUTH_ENABLED?.toLowerCase() === 'true'