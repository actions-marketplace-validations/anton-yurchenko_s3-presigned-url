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

    try {
        const cli = new S3Client({
            region,
            credentials: {
                accessKey,
                secretAccessKey,
            },
        });

        const url = getSignedUrl(cli, new GetObjectCommand({
            Bucket: bucket,
            Key: path,
        }), { expiresIn: expiresIn });

        core.info(`s3://${bucket}/${path} - ${url}`)
    } catch (e) {
        core.setFailed(`error generating a presigned url: '${e.message}'`)
        process.exit(1)
    }
}

main()