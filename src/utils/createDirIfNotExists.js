import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
    try {
        await fs.access(url);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.mkdir(url);
        } else {
            console.error('Error accessing or creating directory:', err);
            throw err;
        }
    }
};
