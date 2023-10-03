const core = require('@actions/core')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const getSignedUrl = require('@aws-sdk/s3-request-presigner');

function main () {
    const region = core.getInput('region', { required: true });
    const accessKey = core.getInput('access_key', { required: true });
    const secretAccessKey = core.getInput('secret_access_key', { required: true });
    const bucket = core.getInput('bucket', { required: true });
    const expiresIn = parseInt(core.getInput('expires_in', { required: false }));
    const path = core.getInput('path', { required: true });

    core.info(`initializing s3`)
    try {
        const cli = new S3Client({
            region,
            credentials: {
                accessKey,
                secretAccessKey,
            },
        });
    } catch (err) {
        core.setFailed(`error initializing s3 client: '${error.message}'`)
        process.exit(1)
    }

    core.info(`generating a presigned url for 's3://${bucket}/${path}'`)
    try {
        const url = getSignedUrl(cli, new GetObjectCommand({
            Bucket: bucket,
            Key: path,
        }), { expiresIn: expiresIn });

        core.setOutput('url', url);
    } catch (err) {
        core.setFailed(`error generating a presigned url: '${error.message}'`)
        process.exit(1)
    }
    core.info(`presigned url: '${url}'`)
}

main()