export const checkUUID = (id: string): boolean => {
    // kiểm tra UUID v4
    const uuidRegexv4 =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    // kiểm tra UUID v7
    const uuidRegexv7 =
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    // return
    return uuidRegexv4.test(id) || uuidRegexv7.test(id)
}
