const core = require('@actions/core')
const AWS = require('aws-sdk');

function main () {
    const region = core.getInput('region', { required: true });
    const accessKey = core.getInput('access_key', { required: true });
    const secretAccessKey = core.getInput('secret_access_key', { required: true });
    const bucket = core.getInput('bucket', { required: true });
    const expiresIn = core.parseInt(core.getInput('expires_in', { required: false }));
    const path = core.getInput('path', { required: true });

    AWS.config.update({
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
        region: region,
    });

    try {
        const s3 = new AWS.S3();

        const params = {
            Bucket: bucket,
            Key: path,
            Expires: expiresIn
        };

        s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) {
                console.error('Error generating presigned URL:', err);
            } else {
                core..info(`s3://${bucket}/${path} - ${url}`)
            }
        });
    } catch (e) {
        core.setFailed(`error generating a presigned url: '${e.message}'`)
        process.exit(1)
    }
}

main()