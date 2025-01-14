/* This is part of the ianm/synopsis project.

 * Additional modifications (c)2020 Ian Morland
 *
 * Modified code (c)2019 Jordan Schnaidt
 *
 * Original code (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { extend } from 'flarum/common/extend';
import app from 'flarum/common/app';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import { truncate } from 'flarum/common/utils/string';

export default function addSummaryExcerpt() {
    extend(DiscussionListState.prototype, 'requestParams', function (params) {
        params.include.push(['firstPost', 'lastPost']);
    });

    extend(DiscussionListItem.prototype, 'infoItems', function (items) {
        const discussion = this.attrs.discussion;

        if (app.session.user && !app.session.user.preferences().showSynopsisExcerpts) {
            return;
        }

        const excerptPost = app.forum.attribute('synopsis.excerpt_type') === 'first' ? discussion.firstPost() : discussion.lastPost();
        const excerptLength = app.forum.attribute('synopsis.excerpt_length');
        const richExcerpt = app.forum.attribute('synopsis.rich_excerpts');
        const onMobile = app.session.user ? app.session.user.preferences().showSynopsisExcerptsOnMobile : false;

        if (excerptPost) {
            const excerpt = (
                <div inert>
                    {richExcerpt ? m.trust(truncate(excerptPost.contentHtml(), excerptLength)) : truncate(excerptPost.contentPlain(), excerptLength)}
                </div>
            );

            items.add(onMobile ? 'excerptM' : 'excerpt', excerpt, -100);
        }
    });
}
