import { GithubOutlined } from "@ant-design/icons";
import { config } from "~/config"

export function SocialMedia() {
  return (
    <div className="mt-[40px]">
      <a href={config.github.url} target="blank">
        <GithubOutlined
          style={{
            fontSize: 20,
          }}
        ></GithubOutlined>
      </a>
    </div>
  );
}
