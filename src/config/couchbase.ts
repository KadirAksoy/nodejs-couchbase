import {
  Bucket,
  Cluster,
  Collection,
  connect,
  ConnectOptions,
  GetResult,
  QueryResult,
} from "couchbase";

export async function db() {
  const clusterConnStr: string = "couchbase://127.0.0.1";
  const username: string = "Administrator";
  const password: string = "123456";
  const bucketName: string = "myBucket";

  const connectOptions: ConnectOptions = {
    username: username,
    password: password,
    // Sets a pre-configured profile called "wanDevelopment" to help avoid latency issues
    // when accessing Capella from a different Wide Area Network
    // or Availability Zone (e.g. your laptop).
    configProfile: "wanDevelopment",
  };

  // cluster bağlantısı
  const cluster: Cluster = await connect(clusterConnStr, connectOptions);

  // bucket bağlantısı
  const bucket: Bucket = cluster.bucket(bucketName);

  // default bir collention oluşturuldu.
  const collection_default: Collection = bucket.defaultCollection();

  console.log("Database'e bağlanildi..");

  return { cluster, bucket, collection_default };
}
