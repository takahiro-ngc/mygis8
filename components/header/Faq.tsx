import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const FaqContent = ({ title, children }) => (
  <>
    <Typography variant="h5" component="h2" style={{ marginBottom: 8 }}>
      {title}
    </Typography>
    <Typography variant="body1" component="p">
      {children}
    </Typography>
  </>
);
export default function Faq() {
  return (
    <>
      <FaqContent title="地図を傾けるには">
        PC：右クリック又はShiftキーでドラッグ
        <br />
        スマホ：三本指で上下にドラッグ
      </FaqContent>

      <hr style={{ margin: "16px 0px" }} />

      <FaqContent title="データが表示されない場合は">
        ・一部データは，特定の地域のみ対象です。当該地域まで移動してみてください。
        <br />
        ・一部データは，特定のズームレベルでのみ表示されます。対象地域で拡大・縮小を試してみてください。
      </FaqContent>

      <hr style={{ margin: "16px 0px" }} />

      <FaqContent title="データの二次利用について">
        ・データは，全て，出典元に著作権があります。
        <br />
        ・印刷物の配布や画像の掲載等をする場合，出典元のサイトでルールを確認してください（多くは，出典の記載のみで利用可能です）。
        <br />
        ・出典の記載は，それに加え，本サイト名も記載してください。ご連絡は不要です。
        <br />
        ・なお，リンクの掲載は，二次利用ではありませんので自由です。
      </FaqContent>

      <hr style={{ margin: "16px 0px" }} />

      <FaqContent title="このサイトについて">
        サイト名：色々な地図。
        <br />
        URL：
        <br />
        運営者：個人
        <br />
        連絡先：aaa@example.com
        <br />
        技術情報：github
      </FaqContent>
    </>
  );
}
