setup(ae) {
  const {videoData: I, aid: G, fansNum: D, ugcFollowed: J, beFollowed: z, followType: N} = oe(Ct())
    , {dialogType: Y, dialogShow: $} = oe(Rt())
    , {userInfo: j} = oe(Zt())
    , {spmid: Z} = oe(nt())
    , k = ve({})
    , T = ve(!1)
    , _ = ve([{
      type: "set",
      label: "\u8BBE\u7F6E\u5206\u7EC4"
  }, {
      type: "cancel",
      label: "\u53D6\u6D88\u5173\u6CE8"
  }])
    , F = ve(null);
  let O;
  const he = {
      0: "\u5173\u6CE8",
      1: "\u5173\u6CE8",
      2: "\u5DF2\u5173\u6CE8",
      3: "\u5DF2\u4E92\u7C89"
  }
    , W = Pe( () => {
      let {pendant: pe, card: Se, vip: ie, like_num: P} = I.value.Card
        , {show_info: x} = I.value.elec;
      const ee = J.value ? 2 : 0
        , de = z.value ? 1 : 0
        , Me = (ie == null ? void 0 : ie.vipStatus) && ie.type == 2
        , Ue = (ie == null ? void 0 : ie.theme_type) === 1 && ie.type == 2;
      let fe = "";
      if (Se != null && Se.Official) {
          const {type: ge} = Se.Official;
          switch (!0) {
          case ge === 0:
              fe = "personal";
              break;
          case ge === 1:
              fe = "business";
              break;
          case Ue:
              fe = "small-vip";
              break;
          case Me:
              fe = "big-vip";
              break
          }
      }
      return {
          sVip: Ue,
          isVip: Me,
          iconType: fe,
          elecState: x == null ? void 0 : x.show,
          upid: Se == null ? void 0 : Se.mid,
          name: (Se == null ? void 0 : Se.name) || "",
          face: (Se == null ? void 0 : Se.face) || "",
          face_nft: (Se == null ? void 0 : Se.face_nft) || "",
          pendantImage: pe == null ? void 0 : pe.image,
          image_enhance: pe == null ? void 0 : pe.image_enhance,
          image_enhance_frame: pe == null ? void 0 : pe.image_enhance_frame,
          followText: he[ee + de],
          fans: At(D.value),
          like: String(P) === "--" ? P : At(P),
          upColor: ie != null && ie.nickname_color ? ie.nickname_color : "var(--text1)"
      }
  }
  );
  ft(async () => {
      Oe(I, () => {
          setTimeout( () => {
              we()
          }
          , 0)
      }
      , {
          immediate: !0
      })
  }
  ),
  Jt( () => {
      T.value = !0
  }
  );
  const re = pe => {}
    , K = () => {}
    , te = pe => {
      !pe || Tn("window/openMainWindowPage", {
          page: "SpacePage",
          meta: {
              mid: pe,
              fromOuterSpmId: Z.value
          }
      })
  }
    , U = () => {
      $.value = !0,
      Y.value = "followedgroup"
  }
    , le = pe => {
      switch (pe.type) {
      case "set":
          U();
          break;
      case "cancel":
          ue();
          break
      }
  }
    , ue = (pe, Se) => {
      if (J.value && Se)
          return;
      if (!j.value.isLogin) {
          Ft("ugcUp.follow");
          return
      }
      let ie = 1;
      J.value && (ie = N.value === 1 ? 4 : 2),
      Nt.followChange({
          fid: W.value.upid,
          act: ie,
          re_src: 14
      }).then(ee => {
          ie === 1 ? (D.value++,
          J.value = !0,
          N.value = 2) : (D.value--,
          J.value = !1)
      }
      ).catch(ee => {
          ut({
              el: pe == null ? void 0 : pe.target,
              msg: (ee == null ? void 0 : ee.message) || "\u5173\u6CE8\u5931\u8D25",
              cd: 1200,
              type: "error"
          })
      }
      );
      const P = ie === 1 ? "follow" : "unfollow"
        , x = {
          up_id: W.value.upid,
          aid: G.value,
          action: ie === 1 ? "add_follow" : "delete_follow",
          type: "single_up"
      };
      lt({
          type: "click",
          spm_info: `main.play-detail.${P}.0`
      }, {
          msg: JSON.stringify(x)
      })
  }
  ;
  function we() {
      const {face: pe, image_enhance_frame: Se, iconType: ie, face_nft: P} = W.value;
      let x = {
          avatar: pe,
          avatarWidth: 44,
          renderWidth: 44,
          iconType: ie,
          isCenterScale: !0,
          isNFT: P
      };
      po ? x = Object.assign(x, {
          pendentWidth: 48 * 1.75
      }) : x = Object.assign(x, {
          pendentWidth: Se ? 44 * 1.75 * 40 : 44 * 1.75,
          stepWidth: 44 * 1.75,
          isAnimate: !!Se,
          duration: 2
      }),
      O = new No,
      O.append(x, F.value, "avatar")
  }
  return (pe, Se) => (m(),
  C("div", nd, [o("div", {
      ref_key: "avatar",
      ref: F,
      class: Re(["u-face", {
          "avatar-loaded": T.value
      }]),
      "report-id": "head",
      onMouseenter: Se[0] || (Se[0] = ie => re()),
      onMouseleave: Se[1] || (Se[1] = ie => K()),
      onClick: Se[2] || (Se[2] = ie => te(n(W).upid))
  }, null, 34), o("div", ad, [o("div", rd, [k.value.live_status === 1 ? (m(),
  C("a", {
      key: 0,
      href: k.value.live_url,
      target: "_blank",
      class: "live-status"
  }, "\u76F4\u64AD\u4E2D", 8, od)) : Ae("", !0), o("div", {
      class: Re(["username", {
          is_vip: n(W).isVip,
          "small-vip": n(W).sVip,
          "is-live": k.value.live_status
      }]),
      target: "_blank",
      "report-id": "name",
      onMouseenter: Se[3] || (Se[3] = ie => re()),
      onMouseleave: Se[4] || (Se[4] = ie => K()),
      onClick: Se[5] || (Se[5] = ie => te(n(W).upid))
  }, [We(ce(n(W).name) + " ", 1), ld], 34)]), o("div", ud, [o("span", cd, ce(n(W).fans) + "\u7C89\u4E1D", 1), o("span", hd, ce(n(W).like) + "\u70B9\u8D5E", 1)]), H(Sn, {
      class: "ugc-follow",
      items: _.value,
      isHover: !0,
      showMenu: n(J),
      onSelect: le
  }, {
      default: Mt( () => [o("div", {
          class: Re(["follow-btn", n(J) ? "following" : "not-follow"]),
          onClick: Se[6] || (Se[6] = ie => ue(ie, !0))
      }, [o("span", {
          class: Re({
              "has-charge": n(W).elecState
          })
      }, [n(J) ? (m(),
      Ve(n(ll), {
          key: 0,
          class: "follow-menu"
      })) : (m(),
      Ve(n(ul), {
          key: 1,
          class: "follow-menu"
      })), We(" " + ce(n(W).followText) + " ", 1), o("span", dd, ce(n(W).fans), 1)], 2)], 2)]),
      _: 1
  }, 8, ["items", "showMenu"])])]))
}