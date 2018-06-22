import './PartupInviteHeader.css';

import * as moment from 'moment';
import * as React from 'react';
import * as c from 'classnames';
import { InviteDocument } from 'collections/Invites';
import { translate } from 'utils/translate';
import { Users, UserDocument } from 'collections/Users';
import { renderToTranslatableString } from 'utils/renderToTranslatableString';
import { Link } from 'components/Router/Link';

interface Props {
    className?: string;
    invite: InviteDocument;
}

interface State {}

export class PartupInviteHeader extends React.Component<Props, State> {

    private inviter: UserDocument;

    public componentWillMount() {
        const { invite } = this.props;
        this.inviter = Users.findOneAny({ _id: invite.inviter_id }) as UserDocument;
    }

    public render() {
        if (!this.inviter) {
            return '';
        }
        return (
            <div className={this.getClassNames()} dangerouslySetInnerHTML={{ __html: this.getHeaderText() }}/>
        );
    }

    private getHeaderText() {
        const { invite } = this.props;

        return translate('pur-partup-start-invite_header-inviter', {
            inviter: renderToTranslatableString(
                <Link to={`/profile/${this.inviter._id}`} target={`_partup`}>
                    {this.inviter.profile.name}
                </Link>,
            ),
            invited_at: moment(invite.created_at).format('D MMMM YYYY'),
            interpolation: { escapeValue: false },
        }).replace('||', '__');
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupInviteHeader', {
            // 'pur-PartupInviteHeader--modifier-class': boolean,
        }, className);
    }
}
